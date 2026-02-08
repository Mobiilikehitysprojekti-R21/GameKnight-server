import SessionPlayerRepository from "../../ports/SessionPlayerRepository";

export interface findBySessionIDInput {
    session_id: number;
}

class findBySessionID {
    private readonly sessionPlayerRepository: SessionPlayerRepository;

    constructor(sessionPlayerRepository: SessionPlayerRepository){
        this.sessionPlayerRepository = sessionPlayerRepository;
    }

    async execute({session_id}: findBySessionIDInput): Promise<void> {
        
        if(!session_id){
            return;}

        await this.sessionPlayerRepository.findBySessionID(session_id);
    }
}

export default findBySessionID;