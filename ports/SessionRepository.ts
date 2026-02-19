import Session from "../domain/Session";

export interface SessionPlayerDTO {
  user_id: number | null;
  guest_name: string | null;
  score: number | null;
  is_winner: boolean;
}

export interface SessionDTO {
  session_id: number;
  group_id: number | null;
  game_id: number;
  played_at: Date;
  location_id: number | null;
  notes: string | null;
  bgg_id: number;
  game_name: string;
  thumbnail_url: string | null;
  players: SessionPlayerDTO[];
}

abstract class SessionRepository {
  abstract findByGroupID(groupID: number): Promise<Session[]>;

  // Read models used by the HTTP API.
  abstract getSessions(): Promise<SessionDTO[]>;
  abstract getSessionById(sessionId: number): Promise<SessionDTO | undefined>;
  abstract getSessionsByUserId(userId: number): Promise<SessionDTO[]>;

  // Write model
  abstract createSessions(input: {
    user_id: number;
    group_id?: number | null;
    game_id: number;
    played_at: Date;
    location_id?: number | null;
    notes?: string;
    guest_players?: Array<{ name: string }>;
  }): Promise<Session | undefined>;
  abstract updateSession(session: Session): Promise<void>;
}

export default SessionRepository;
