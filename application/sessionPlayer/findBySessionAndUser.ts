import SessionPlayerRepository from "../../ports/SessionPlayerRepository";

export interface findBySessionAndUserInput {
    session_id: number;
    user_id: number;
}

class findBySessionAndUser {
    private readonly sessionPlayerRepository: SessionPlayerRepository;

    constructor(sessionPlayerRepository: SessionPlayerRepository){
        this.sessionPlayerRepository = sessionPlayerRepository;
    }

    async execute({session_id, user_id}: findBySessionAndUserInput): Promise<void> {
        
        if(!session_id || !user_id){
            return;}

        await this.sessionPlayerRepository.findBySessionAndUser(session_id, user_id);
    }
}

export default findBySessionAndUser;