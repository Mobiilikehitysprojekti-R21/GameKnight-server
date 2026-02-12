import { blob } from "node:stream/consumers";
import BoardGame from "../../domain/BoardGame";
import BoardGameRepository from "../../ports/BoardGameRepository";

export interface DeleteBoardGameInput {
    bgg_id: number
}

class DeleteBoardGame {
    private readonly boardgameRepository: BoardGameRepository;

    constructor(boardGameRepository: BoardGameRepository)
    {
        this.boardgameRepository = boardGameRepository
    }

    async execute({bgg_id}: DeleteBoardGameInput): Promise<void> {
        
        if(!bgg_id){
            return;
        }

        return this.boardgameRepository.deleteBoardGame(bgg_id);
    }
}

export default DeleteBoardGame;