import SessionPlayerRepository from "../../ports/SessionPlayerRepository";

export interface saveSessionPlayerInput {
    session_id: number;
    user_id: number;
    score?: number | null;
    is_winner?: boolean | null;
}

class saveSessionPlayer {
    private readonly sessionPlayerRepository: SessionPlayerRepository;

    constructor(sessionPlayerRepository: SessionPlayerRepository){
        this.sessionPlayerRepository = sessionPlayerRepository;
    }

    async execute(input: saveSessionPlayerInput): Promise<void> {
        
        if(!input.session_id){
            return;}

        await this.sessionPlayerRepository.saveSessionPlayer({
            session_id: input.session_id,
            user_id: input.user_id,
            score: input.score ?? undefined,
            is_winner: input.is_winner ?? false
        });
    }
}

export default saveSessionPlayer