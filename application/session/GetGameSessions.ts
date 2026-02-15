import SessionRepository from "../../ports/SessionRepository";
// testaan

export interface getSessionsInput {
    session_id: number;
    game_id: number;
    played_at: Date;
    location_id?: number | null;
}

class getSessions {
    private readonly sessionRepository: SessionRepository;

    constructor(sessionRepository: SessionRepository){
        this.sessionRepository = sessionRepository;
    }

    async execute({session_id}: getSessionsInput): Promise<void> {
        
        if(!session_id){
            return;}

        await this.sessionRepository.getSessions();
    }
}

export default getSessions;