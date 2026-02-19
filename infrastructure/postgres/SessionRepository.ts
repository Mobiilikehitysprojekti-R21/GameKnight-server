import SessionRepository, { SessionDTO, SessionPlayerDTO } from "../../ports/SessionRepository";
import Session from "../../domain/Session";
import { Pool } from "pg";

type SessionRow = Omit<SessionDTO, "players"> & {
  players: SessionPlayerDTO[] | null;
};

function normalizePlayers(players: SessionPlayerDTO[] | null | unknown): SessionPlayerDTO[] {
  if (!players) return [];
  if (!Array.isArray(players)) return [];

  return players
    .filter((p) => p && typeof p === "object")
    .map((p: any) => ({
      user_id: p.user_id == null ? null : Number(p.user_id),
      guest_name: p.guest_name || null,
      score: p.score == null ? null : Number(p.score),
      is_winner: Boolean(p.is_winner),
    }))
}

function toSessionDTO(row: SessionRow): SessionDTO {
  return {
    session_id: row.session_id,
    group_id: row.group_id,
    game_id: row.game_id,
    played_at: row.played_at,
    location_id: row.location_id,
    notes: row.notes,
    bgg_id: row.bgg_id,
    game_name: row.game_name,
    thumbnail_url: row.thumbnail_url,
    players: normalizePlayers(row.players),
  };
}

class PostgresSessionRepository extends SessionRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    super();
    this.pool = pool;
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

  async getSessions(): Promise<SessionDTO[]> {
    const result = await this.pool.query<SessionRow>(`
        SELECT 
            s.session_id, s.group_id, s.game_id, s.played_at, s.location_id, s.notes,
            b.bgg_id,
            b.name as game_name,
            b.thumbnail_url,
            COALESCE(
              json_agg(
                json_build_object(
                    'user_id', sp.user_id,
                    'guest_name', sp.guest_name,
                    'score', sp.score,
                    'is_winner', sp.is_winner
                )
                ORDER BY sp.user_id NULLS LAST
              ) FILTER (WHERE sp.user_id IS NOT NULL OR sp.guest_name IS NOT NULL),
              '[]'::json
            ) as players
        FROM sessions s
        JOIN boardgames b ON b.game_id = s.game_id
        LEFT JOIN session_players sp ON s.session_id = sp.session_id
        GROUP BY s.session_id, b.bgg_id, b.name, b.thumbnail_url
        ORDER BY s.played_at DESC
    `);

    return result.rows.map(toSessionDTO);
  }

  async getSessionById(sessionId: number): Promise<SessionDTO | undefined> {
    const result = await this.pool.query<SessionRow>(
      `SELECT 
          s.session_id, s.group_id, s.game_id, s.played_at, s.location_id, s.notes,
          b.bgg_id,
          b.name as game_name,
          b.thumbnail_url,
          COALESCE(
            json_agg(
              json_build_object(
                  'user_id', sp.user_id,
                  'guest_name', sp.guest_name,
                  'score', sp.score,
                  'is_winner', sp.is_winner
              )
              ORDER BY sp.user_id NULLS LAST
            ) FILTER (WHERE sp.user_id IS NOT NULL OR sp.guest_name IS NOT NULL),
            '[]'::json
          ) as players
        FROM sessions s
        JOIN boardgames b ON b.game_id = s.game_id
        LEFT JOIN session_players sp ON s.session_id = sp.session_id
        WHERE s.session_id = $1
        GROUP BY s.session_id, b.bgg_id, b.name, b.thumbnail_url`,
      [sessionId]
    );

    if (result.rowCount === 0) return undefined;
    return toSessionDTO(result.rows[0]);
  }

  async getSessionsByUserId(userId: number): Promise<SessionDTO[]> {
    const result = await this.pool.query<SessionRow>(
      `SELECT 
          s.session_id, s.group_id, s.game_id, s.played_at, s.location_id, s.notes,
          b.bgg_id,
          b.name as game_name,
          b.thumbnail_url,
          COALESCE(
            json_agg(
              json_build_object(
                  'user_id', sp.user_id,
                  'guest_name', sp.guest_name,
                  'score', sp.score,
                  'is_winner', sp.is_winner
              )
              ORDER BY sp.user_id NULLS LAST
            ) FILTER (WHERE sp.user_id IS NOT NULL OR sp.guest_name IS NOT NULL),
            '[]'::json
          ) as players
        FROM sessions s
        JOIN boardgames b ON b.game_id = s.game_id
        LEFT JOIN session_players sp ON s.session_id = sp.session_id
        WHERE EXISTS (
          SELECT 1
          FROM session_players sp2
          WHERE sp2.session_id = s.session_id
            AND (sp2.user_id = $1 OR sp2.guest_name IS NOT NULL)
        )
        GROUP BY s.session_id, b.bgg_id, b.name, b.thumbnail_url
        ORDER BY s.played_at DESC`,
      [userId]
    );

    return result.rows.map(toSessionDTO);
  }

  async createSessions({
    user_id,
    group_id,
    game_id,
    played_at,
    location_id,
    notes,
    guest_players
  }: {
    user_id: number;
    group_id?: number | null;
    game_id: number;
    played_at: Date;
    location_id?: number | null;
    notes?: string;
    guest_players?: Array<{ name: string }>;
  }): Promise<Session | undefined> {
    const result = await this.pool.query(
      `INSERT INTO sessions (group_id, game_id, played_at, location_id, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING session_id, group_id, game_id, played_at, location_id, notes`,
      [
        group_id ?? null,
        game_id,
        played_at,
        location_id ?? null,
        notes ?? null
      ]
    );

    if (result.rowCount === 0) return undefined;

    const row = result.rows[0];
    const sessionId = row.session_id as number;

    // Add creator as a session player
    await this.pool.query(
      `INSERT INTO session_players (session_id, user_id)
       VALUES ($1, $2)`,
      [sessionId, user_id]
    );

    // Add guest players if provided
    if (guest_players && guest_players.length > 0) {
      for (const guest of guest_players) {
        await this.pool.query(
          `INSERT INTO session_players (session_id, guest_name)
           VALUES ($1, $2)`,
          [sessionId, guest.name]
        );
      }
    }

    return new Session({
      session_id: sessionId,
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
