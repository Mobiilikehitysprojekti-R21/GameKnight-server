import SessionRepository, { SessionDTO } from "../../ports/SessionRepository";

export interface GetSessionByIdInput {
  sessionId: number;
}

class GetSessionById {
  private readonly sessionRepository: SessionRepository;

  constructor(sessionRepository: SessionRepository) {
    this.sessionRepository = sessionRepository;
  }

  async execute({ sessionId }: GetSessionByIdInput): Promise<SessionDTO | undefined> {
    if (!sessionId) return undefined;
    return this.sessionRepository.getSessionById(sessionId);
  }
}

export default GetSessionById;
