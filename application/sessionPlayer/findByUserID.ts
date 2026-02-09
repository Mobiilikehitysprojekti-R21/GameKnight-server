import SessionPlayerRepository from "../../ports/SessionPlayerRepository";

export interface findByUserIDInput {
    user_id: number;
}

class findByUserID {
    private readonly sessionPlayerRepository: SessionPlayerRepository;

    constructor(sessionPlayerRepository: SessionPlayerRepository){
        this.sessionPlayerRepository = sessionPlayerRepository;
    }

    async execute({user_id}: findByUserIDInput): Promise<void> {
        
        if(!user_id){
            return;}

        await this.sessionPlayerRepository.findByUserID(user_id);
    }
}

export default findByUserID;