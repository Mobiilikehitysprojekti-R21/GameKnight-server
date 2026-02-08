// infrastructure/postgres/FriendRepository.ts
import FriendRepository from "../../ports/FriendRepository";
import Friendship, { Friend, FriendRequest, FriendInviteResult } from "../../domain/Friendship";
import { Pool } from "pg";

class PostgresFriendRepository extends FriendRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    super();
    this.pool = pool;
  }

  async getFriends(userId: number): Promise<Friend[]> {
    const result = await this.pool.query(
      `
      SELECT u.user_id, u.nickname
      FROM friendships f
      JOIN users u ON u.user_id = f.friend_id
      WHERE f.user_id = $1 AND f.status = 'accepted'
      ORDER BY LOWER(u.nickname) ASC`,
      [userId]
    );

    return result.rows.map((row) => ({
      user_id: row.user_id,
      nickname: row.nickname,
    }));
  }

  /**
   * Lähettää kaveripyynnön nicknamella:
   * - hakee friendin user_id users-taulusta
   * - INSERT friendships (me -> friend) status='pending'
   * Palauttaa luodun pyynnön request_id:n.
   */
  async addFriend(userId: number, nickname: string): Promise<number> {
    const lookup = await this.pool.query(
      `SELECT user_id FROM users WHERE LOWER(nickname) = LOWER($1)`,
      [nickname]
    );

    if (lookup.rowCount === 0) {
      throw new Error("User with nickname not found");
    }

    const friendId = lookup.rows[0].user_id as number;

    if (friendId === userId) {
      throw new Error("A user cannot be friends with themselves");
    }

    // Estä duplikaattipending/accepted – upsert pending
    const insert = await this.pool.query(
      `
      INSERT INTO friendships (user_id, friend_id, status)
      VALUES ($1, $2, 'pending')
      ON CONFLICT (user_id, friend_id)
      DO UPDATE SET status = 'pending'
      RETURNING request_id
      `,
      [userId, friendId]
    );

    return insert.rows[0].request_id as number;
  }

  /**
   * Saapuneet pyynnöt:
   * friendships.user_id = lähettäjä, friendships.friend_id = vastaanottaja (me), status='pending'
   * Palauttaa request_id + lähettäjän tiedot.
   */
  async getFriendRequests(userId: number): Promise<FriendRequest[]> {
    const result = await this.pool.query(
      `SELECT
        f.request_id,
        u.user_id AS from_user_id,
        u.nickname AS from_nickname,
        f.friend_id AS to_user_id,
        u2.nickname AS to_nickname,
        f.created_at
      FROM friendships f
      JOIN users u ON u.user_id = f.user_id
      JOIN users u2 ON u2.user_id = f.friend_id
      WHERE f.friend_id = $1 AND f.status = 'pending'
      ORDER BY f.created_at DESC`,
      [userId]
    );

    return result.rows.map((row) => ({
      request_id: row.request_id,
      from_user_id: row.from_user_id,
      from_nickname: row.from_nickname,
      to_user_id: row.to_user_id,
      to_nickname: row.to_nickname,
      created_at: row.created_at,
    }));
}

  /**
   * Hyväksy pyyntö request_id:llä.
   * - varmistaa että pyyntö kuuluu tälle käyttäjälle (friend_id = me) ja on pending
   * - päivittää status=accepted
   * - luo vastarivin (me -> sender) accepted (upsert)
   */
  async acceptRequest(userId: number, requestId: number): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      const update = await client.query(
        `UPDATE friendships
        SET status = 'accepted'
        WHERE request_id = $1 AND friend_id = $2 AND status = 'pending'
        RETURNING user_id AS sender_id, friend_id AS receiver_id`,
        [requestId, userId]
      );

      if (update.rowCount === 0) {
        throw new Error("Friend request not found (or not yours / not pending)");
      }

      const senderId = update.rows[0].sender_id as number;   // pyynnön lähettäjä
      const receiverId = update.rows[0].receiver_id as number; // minä (userId)

      // Vastarivi receiver -> sender
      await client.query(
        `INSERT INTO friendships (user_id, friend_id, status)
        VALUES ($1, $2, 'accepted')
        ON CONFLICT (user_id, friend_id)
        DO UPDATE SET status = 'accepted'`,
        [receiverId, senderId]
      );

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /* Hylkää pyyntö request_id:llä */
  async declineRequest(userId: number, requestId: number): Promise<void> {
    const result = await this.pool.query(
      `DELETE FROM friendships
      WHERE request_id = $1 AND friend_id = $2 AND status = 'pending'`,
      [requestId, userId]
    );

    if (result.rowCount === 0) {
      throw new Error("Friend request not found (or not yours / not pending)");
    }
  }

  /**
   * Invite sähköpostilla (tallennetaan invites-tauluun).
   * Tässä ei lähetetä oikeaa sähköpostia; se tehdään erikseen (esim. SendGrid).
   */
  async inviteFriend(userId: number, email: string): Promise<FriendInviteResult> {
    // Jos email löytyy users-taulusta -> jo käyttäjä
    const exists = await this.pool.query(
      `SELECT 1 FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
      [email]
    );

    if ((exists.rowCount ?? 0) > 0) {
      return { email, status: "already_user" };
    }

    // Jos kutsu on jo lähetetty aiemmin (sama invited_email)
    const alreadyInvited = await this.pool.query(
      `SELECT token
      FROM invites
      WHERE LOWER(invited_email) = LOWER($1)
      ORDER BY created_at DESC LIMIT 1`,
      [email]
    );

    if ((alreadyInvited.rowCount ?? 0) > 0) {
      return { email, status: "already_invited", token: alreadyInvited.rows[0].token };
    }

    const insert = await this.pool.query(
      `INSERT INTO invites (invited_email, invited_by_user_id, status)
      VALUES ($1, $2, 'sent')
      RETURNING token`,
      [email, userId]
    );

    return { email, status: "sent", token: insert.rows[0].token };
  }


  async findByRequestID(requestId: number): Promise<Friendship | undefined> {
    const result = await this.pool.query(
      `SELECT * FROM friendships WHERE request_id = $1`,
      [requestId]
    );

    if (result.rowCount === 0) return undefined;

    const row = result.rows[0];
    return new Friendship({
      request_id: row.request_id,
      user_id: row.user_id,
      friend_id: row.friend_id,
      status: row.status,
    });
  }
}

export default PostgresFriendRepository;
