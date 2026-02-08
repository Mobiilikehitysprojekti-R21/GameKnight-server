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
    });
  }

  async findById(user_id: string): Promise<User | undefined> {
    const result = await this.pool.query(
      `SELECT * FROM users WHERE user_id = $1`,
      [user_id]
    );

    if (result.rowCount === 0) return undefined;

    const row = result.rows[0];

    return new User({
      user_id: row.user_id,
      email: row.email,
      auth0_id: row.auth0_id,
      nickname: row.nickname,
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
      });
    } else {
      throw new Error("Failed to update nickname");
    }
  }

}

export default PostgresUserRepository;
