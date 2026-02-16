import BoardGame from "../../domain/BoardGame";
import BoardGameRepository from "../../ports/BoardGameRepository";

export interface GetUserGameCollectionInput {
    userId: string
}

class GetUserGameCollection {
    private readonly boardgameRepository: BoardGameRepository;

    constructor(boardGameRepository: BoardGameRepository)
    {
        this.boardgameRepository = boardGameRepository
    }

    async execute({userId}: GetUserGameCollectionInput): Promise<BoardGame[]> {
        
        if(!userId){
            return [];
        }

        return this.boardgameRepository.getUserGameCollection(userId);
    }
}

export default GetUserGameCollection;