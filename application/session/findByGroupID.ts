import SessionRepository from "../../ports/SessionRepository";

export interface findByGroupIDInput {
    group_id?: number | null;
}

class findByGroupID {
    private readonly sessionRepository: SessionRepository;

    constructor(sessionRepository: SessionRepository){
        this.sessionRepository = sessionRepository;
    }

    async execute({group_id}: findByGroupIDInput): Promise<void> {
        
        if(!group_id){
            return;}

        await this.sessionRepository.findByGroupID(group_id);
    }
}

export default findByGroupID;