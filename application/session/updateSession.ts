import Session, { SessionProps } from "../../domain/Session";
import SessionRepository from "../../ports/SessionRepository";

export default class UpdateSession {
  private sessionRepository: SessionRepository;

  constructor(sessionRepository: SessionRepository) {
    this.sessionRepository = sessionRepository;
  }

  async execute(session: SessionProps): Promise<void> {
    await this.sessionRepository.updateSession(new Session(session));
  }
}
