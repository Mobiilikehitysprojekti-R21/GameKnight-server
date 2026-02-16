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

  async getSessions(): Promise<any[]> {
    const result = await this.pool.query(`
        SELECT 
            s.session_id, s.group_id, s.game_id, s.played_at, s.location_id, s.notes,
            json_agg(
                json_build_object(
                    'user_id', sp.user_id,
                    'score', sp.score,
                    'is_winner', sp.is_winner
                )
            ) as players
        FROM sessions s
        LEFT JOIN session_players sp ON s.session_id = sp.session_id
        GROUP BY s.session_id
    `);
    
    return result.rows;
}

  async createSessions({
    session_id,
    group_id,
    user_id,
    game_id,
    played_at,
    location_id,
    notes
  }: {
    session_id: number;
    group_id?: number | null;
    user_id?: number | null;
    game_id: number;
    played_at: Date;
    location_id?: number | null;
    notes?: string;
  }): Promise<Session | undefined> {
    const result = await this.pool.query(
      `INSERT INTO sessions (session_id, group_id, user_id, game_id, played_at, location_id, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        session_id,
        group_id ?? null,
        user_id ?? null,
        game_id,
        played_at,
        location_id ?? null,
        notes ?? null
      ]
    );

    if (result.rowCount === 0) return undefined;

    const row = result.rows[0];
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
      ]);
  }

  async addLocationToSession(session_id: number, location_id: number): Promise<void> {
  await this.pool.query(
    `UPDATE sessions SET location_id = $1 WHERE session_id = $2`,
    [location_id, session_id]
  );
}
}

export default PostgresSessionRepository;
