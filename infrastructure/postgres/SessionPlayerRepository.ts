import SessionPlayerRepository from "../../ports/SessionPlayerRepository";
import SessionPlayer from "../../domain/SessionPlayer";
import { Pool } from "pg";

class PostgresSessionPlayerRepository extends SessionPlayerRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    super();
    this.pool = pool;
  }

  async saveSessionPlayer(sessionPlayer: SessionPlayer): Promise<void> {
    await this.pool.query(
      `INSERT INTO session_players (session_id, user_id, score, is_winner)
       VALUES ($1, $2, $3, $4)`,
      [sessionPlayer.session_id, sessionPlayer.user_id, sessionPlayer.score || null, sessionPlayer.is_winner]
    );
  }

  async findBySessionID(sessionID: number): Promise<SessionPlayer[]> {
    const result = await this.pool.query(
      `SELECT * FROM session_players WHERE session_id = $1`,
      [sessionID]
    );

    return result.rows.map(row => new SessionPlayer({
      session_id: row.session_id,
      user_id: row.user_id,
      score: row.score,
      is_winner: row.is_winner
    }));
  }

  async findByUserID(userID: number): Promise<SessionPlayer[]> {
    const result = await this.pool.query(
      `SELECT * FROM session_players WHERE user_id = $1`,
      [userID]
    );

    return result.rows.map(row => new SessionPlayer({
      session_id: row.session_id,
      user_id: row.user_id,
      score: row.score,
      is_winner: row.is_winner
    }));
  }

  async findBySessionAndUser(sessionID: number, userID: number): Promise<SessionPlayer | undefined> {
    const result = await this.pool.query(
      `SELECT * FROM session_players WHERE session_id = $1 AND user_id = $2`,
      [sessionID, userID]
    );

    if (result.rowCount === 0) return undefined;

    const row = result.rows[0];
    return new SessionPlayer({
      session_id: row.session_id,
      user_id: row.user_id,
      score: row.score,
      is_winner: row.is_winner
    });
  }
}

export default PostgresSessionPlayerRepository;
