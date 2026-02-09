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

getSessions(): Promise<Session[]> {
    return this.pool.query(`SELECT * FROM sessions`)
      .then(result => result.rows.map(row => new Session({
        session_id: row.session_id,
        group_id: row.group_id,
        game_id: row.game_id,
        played_at: row.played_at,
        location_id: row.location_id,
        notes: row.notes
      })));
  }

  async addSession(session: Session): Promise<void> {
    await this.pool.query(
      `INSERT INTO sessions (group_id, game_id, played_at, location_id, notes)
       VALUES ($1, $2, $3, $4, $5)`,
      [session.group_id, session.game_id, session.played_at, session.location_id || null, session.notes || null]
    );
  }
}

export default PostgresSessionRepository;
