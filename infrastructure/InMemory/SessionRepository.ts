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

  async addSession(session: Session): Promise<void> {
    this.sessions.push(session);
  }
}

export default InMemorySessionRepository;
