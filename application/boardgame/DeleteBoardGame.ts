import { blob } from "node:stream/consumers";
import BoardGame from "../../domain/BoardGame";
import BoardGameRepository from "../../ports/BoardGameRepository";

export interface DeleteBoardGameInput {
    bgg_id: number
    auth0_id: string
}

class DeleteBoardGame {
    private readonly boardgameRepository: BoardGameRepository;

    constructor(boardGameRepository: BoardGameRepository)
    {
        this.boardgameRepository = boardGameRepository
    }

    async execute({bgg_id, auth0_id}: DeleteBoardGameInput): Promise<void> {
        
        if(!bgg_id || !auth0_id){
            return;
        }

        return this.boardgameRepository.deleteBoardGame(bgg_id, auth0_id);
    }
}

export default DeleteBoardGame;