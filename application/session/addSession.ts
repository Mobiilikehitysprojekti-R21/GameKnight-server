import SessionRepository from "../../ports/SessionRepository";

export interface addSessionInput {
    session_id: number;
    group_id?: number | null;
    user_id?: number | null;
    game_id: number;
    played_at: Date;
    location_id?: number | null;
    notes?: string;
}

class addSession {
    private readonly sessionRepository: SessionRepository;

    constructor(sessionRepository: SessionRepository){
        this.sessionRepository = sessionRepository;
    }

    async execute({session_id, group_id, user_id, game_id, played_at, location_id, notes}: addSessionInput): Promise<void> {
        
        if(!session_id){
            return;}

        await this.sessionRepository.addSession({session_id, group_id, user_id, game_id, played_at, location_id, notes});
    }
}

export default addSession;