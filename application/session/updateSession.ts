import Session from "../../domain/Session";
import SessionRepository from "../../ports/SessionRepository";

export default class UpdateSession {
  private sessionRepository: SessionRepository;

  constructor(sessionRepository: SessionRepository) {
    this.sessionRepository = sessionRepository;
  }

  async execute(session: Session): Promise<void> {
    await this.sessionRepository.updateSession(session);
  }
}