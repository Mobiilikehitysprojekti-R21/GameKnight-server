import SessionRepository from "../../ports/SessionRepository";
// testaan

class getSessions {
    private readonly sessionRepository: SessionRepository;

    constructor(sessionRepository: SessionRepository){
        this.sessionRepository = sessionRepository;
    }

    async execute(): Promise<any[]> {
        return this.sessionRepository.getSessions();
    }
}

export default getSessions;
