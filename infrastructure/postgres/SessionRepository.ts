import SessionRepository from "../../ports/SessionRepository";
import Session from "../../domain/Session";
import { Pool } from "pg";

class PostgresSessionRepository extends SessionRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    super()
    this.pool = pool
  }

  async findByGroupID(groupID: number): Promise<Session[]> {
    const result = await this.pool.query(
      `SELECT * FROM sessions WHERE group_id = $1`,
      [groupID]
    );

    return result.rows.map(row => new Session({
      session_id: row.session_id,
      group_id: row.group_id,
      game_id: row.game_id,
      played_at: row.played_at,
      location_id: row.location_id,
      notes: row.notes
    }));
  }

  async getSessions(): Promise<Session[]> {
    const result = await this.pool.query(`SELECT * FROM sessions`);
    return result.rows.map(row => new Session({
      session_id: row.session_id,
      group_id: row.group_id,
      game_id: row.game_id,
      played_at: row.played_at,
      location_id: row.location_id,
      notes: row.notes
    }));
  }

  async findByID(sessionID: number): Promise<Session | undefined> {
    const result = await this.pool.query(
      `SELECT * FROM sessions WHERE session_id = $1`,
      [sessionID]
    );

    if (result.rowCount === 0) return undefined

    const row = result.rows[0]
    return new Session({
      session_id: row.session_id,
      group_id: row.group_id,
      game_id: row.game_id,
      played_at: row.played_at,
      location_id: row.location_id,
      notes: row.notes
    });
  }

  async updateSession(session: Session): Promise<void> {
    await this.pool.query(
      `UPDATE sessions SET
        group_id = $1,
        game_id = $2,
        played_at = $3,
        location_id = $4,
        notes = $5
      WHERE session_id = $6`,
      [
        session.group_id,
        session.game_id,
        session.played_at,
        session.location_id || null,
        session.notes || null,
        session.session_id
      ]
    );
  }
}

export default PostgresSessionRepository;
