import SessionRepository, { SessionDTO } from "../../ports/SessionRepository";

export interface GetSessionsByUserIdInput {
  userId: number;
}

class GetSessionsByUserId {
  private readonly sessionRepository: SessionRepository;

  constructor(sessionRepository: SessionRepository) {
    this.sessionRepository = sessionRepository;
  }

  async execute({ userId }: GetSessionsByUserIdInput): Promise<SessionDTO[]> {
    if (!userId) return [];
    return this.sessionRepository.getSessionsByUserId(userId);
  }
}

export default GetSessionsByUserId;
