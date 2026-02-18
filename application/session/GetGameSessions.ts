import SessionRepository, { SessionDTO } from "../../ports/SessionRepository";

class getSessions {
    private readonly sessionRepository: SessionRepository;

    constructor(sessionRepository: SessionRepository){
        this.sessionRepository = sessionRepository;
    }

    async execute(): Promise<SessionDTO[]> {
        return this.sessionRepository.getSessions();
    }
}

export default getSessions;
