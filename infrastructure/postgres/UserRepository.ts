import UserRepository from "../../ports/UserRepository";
import User from "../../domain/User";
import { Pool } from "pg";

class PostgresUserRepository extends UserRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    super();
    this.pool = pool;
  }

  async save(user: User): Promise<User> {
    const result = await this.pool.query(
      `INSERT INTO users (email, auth0_id, nickname)
       VALUES ($1, $2, $3)
       RETURNING user_id, auth0_id, email, nickname`,
      [user.email, user.auth0_id, user.nickname]
    );
    if (result.rows.length > 0) {
      const row = result.rows[0];
      return new User({
        user_id: row.user_id,
        email: row.email,
        auth0_id: row.auth0_id,
        nickname: row.nickname,
        avatar_url: row.avatar_url
      });
    } else {
      throw new Error("Failed to insert user");
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const result = await this.pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (result.rowCount === 0) return undefined;

    const row = result.rows[0];

    return new User({
      user_id: row.user_id,
      email: row.email,
      auth0_id: row.auth0_id,
      nickname: row.nickname,
      avatar_url: row.avatar_url
    });
  }

  async findById(auth0_id: string): Promise<User | undefined> {
    const result = await this.pool.query(
      `SELECT * FROM users WHERE auth0_id = $1`,
      [auth0_id]
    );

    if (result.rowCount === 0) return undefined;

    const row = result.rows[0];

    return new User({
      user_id: row.user_id,
      email: row.email,
      auth0_id: row.auth0_id,
      nickname: row.nickname,
      avatar_url: row.avatar_url
    });
  }

  async findByNickname(nickname: string): Promise<User | undefined> {
    const result = await this.pool.query(
      `SELECT * FROM users WHERE nickname = $1`,
      [nickname]
    );

    if (result.rowCount === 0) return undefined;

    const row = result.rows[0];

    return new User({
      user_id: row.user_id,
      email: row.email,
      auth0_id: row.auth0_id,
      nickname: row.nickname,
      avatar_url: row.avatar_url
    });
  }

  async updateNickname(nickname: string, auth0_id: string): Promise<User> {

    const result = await this.pool.query(
      ` UPDATE users 
        SET nickname = $1
        WHERE auth0_id = $2
        RETURNING user_id, auth0_id, email, nickname
      `,
      [nickname, auth0_id]
    )
    if (result.rows.length > 0) {
      const row = result.rows[0]
      return new User({
        user_id: row.user_id,
        email: row.email,
        auth0_id: row.auth0_id,
        nickname: row.nickname,
        avatar_url: row.avatar_url
      });
    } else {
      throw new Error("Failed to update nickname");
    }
  }

  async addAvatarUrl(avatar_url: string, auth0_id: string): Promise<String> {
    
    try {
    const result = await this.pool.query(
      `UPDATE users
       SET avatar_url = $1
       WHERE auth0_id = $2
       RETURNING avatar_url`,
      [avatar_url, auth0_id]
    );

    if (result.rowCount === 0) {
      throw new Error("User not found");
    }

    return result.rows[0].avatar_url;
  } catch (e: any) {
    throw new Error("Failed to add new avatar url");
  }
}

  async fetchUserNickname(auth0_id: string): Promise<User> {

    const result = await this.pool.query(
      ` SELECT * FROM users 
        WHERE auth0_id = $1
        RETURNING user_id, auth0_id, email, nickname
      `,
      [auth0_id]
    )

    if (result.rows.length > 0) {
      const row = result.rows[0]
      return new User({
        user_id: row.user_id,
        email: row.email,
        auth0_id: row.auth0_id,
        nickname: row.nickname,
        avatar_url: row.avatar_url
      });
    } else {
      throw new Error("Failed to update nickname");
    }
  }

  async deleteUser(auth0_id: string): Promise<void> {

    try {
      await this.pool.query(
      ` DELETE FROM users 
        WHERE auth0_id = $1
      `,
      [auth0_id]
    )

    } catch (e: any) {
      throw new Error("Failed to delete user");
    }
    
  }

}

export default PostgresUserRepository;
