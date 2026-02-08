import BoardGame from "../../domain/BoardGame";
import BoardGameRepository from "../../ports/BoardGameRepository";

export interface AddBoardGameInput {
    game: BoardGame["bgg_id"]
    userId: number 
}

class AddBoardGameToUser {
    private readonly boardgameRepository: BoardGameRepository;

    constructor(boardgameRepository: BoardGameRepository) {
        this.boardgameRepository = boardgameRepository
    }

    async execute({userId, game}: AddBoardGameInput) {
        if (!userId || !game) {
            throw new Error("Missing userId or game in request body")
        }

        return this.boardgameRepository.addBoardGameToUser(userId, game)
    }
}

export default AddBoardGameToUser