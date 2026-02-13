import SessionRepository from "../../ports/SessionRepository";
import Session from "../../domain/Session";

class InMemorySessionRepository extends SessionRepository {
  private readonly sessions: Session[] = [];

  async findByGroupID(groupID: number): Promise<Session[]> {
    return this.sessions.filter(s => s.group_id === groupID);
  }

  async getSessions(): Promise<Session[]> {
    return this.sessions;
  }

  async updateSession(session: Session): Promise<void> {
    const index = this.sessions.findIndex(s => s.session_id === session.session_id);
    if (index !== -1) {
      this.sessions[index] = session;
    } else {
      throw new Error("Session not found");
    }
  }
}

export default InMemorySessionRepository;
