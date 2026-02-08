import Session from "../domain/Session";

abstract class SessionRepository {
  abstract findByGroupID(groupID: number): Promise<Session[]>;
  abstract getSessions(): Promise<Session[]>;
  abstract addSession(session: Session): Promise<void>;
}

export default SessionRepository;
