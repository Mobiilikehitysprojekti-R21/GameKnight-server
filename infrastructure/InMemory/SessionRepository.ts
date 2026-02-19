import SessionRepository, { SessionDTO } from "../../ports/SessionRepository";
import Session from "../../domain/Session";

function toDTO(s: Session): SessionDTO {
  return {
    session_id: s.session_id,
    group_id: s.group_id ?? null,
    game_id: s.game_id,
    played_at: s.played_at,
    location_id: s.location_id ?? null,
    notes: s.notes ?? null,
    // In-memory repo doesn't have boardgame data
    bgg_id: 0,
    game_name: "",
    thumbnail_url: null,
    players: [],
  };
}

class InMemorySessionRepository extends SessionRepository {
  private readonly sessions: Session[] = [];

  async findByGroupID(groupID: number): Promise<Session[]> {
    return this.sessions.filter((s) => s.group_id === groupID);
  }

  async getSessions(): Promise<SessionDTO[]> {
    return this.sessions.map(toDTO);
  }

  async getSessionById(sessionId: number): Promise<SessionDTO | undefined> {
    const s = this.sessions.find((x) => x.session_id === sessionId);
    return s ? toDTO(s) : undefined;
  }

  // In-memory repo does not currently model session_players; return empty for now.
  async getSessionsByUserId(_userId: number): Promise<SessionDTO[]> {
    return [];
  }

  async updateSession(session: Session): Promise<void> {
    const index = this.sessions.findIndex((s) => s.session_id === session.session_id);
    if (index !== -1) {
      this.sessions[index] = session;
    } else {
      throw new Error("Session not found");
    }
  }
}

export default InMemorySessionRepository;
