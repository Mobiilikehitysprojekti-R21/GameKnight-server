import BoardGame from "../../domain/BoardGame";
import BoardGameRepository from "../../ports/BoardGameRepository";

class GetBoardGame {
  private readonly boardgameRepository: BoardGameRepository;

  constructor(boardGameRepository: BoardGameRepository) {
    this.boardgameRepository = boardGameRepository;
  }

  async execute(gameId: number): Promise<BoardGame | undefined> {
    if (!gameId || gameId <= 0) {
      throw new Error("Invalid game_id");
    }

    return this.boardgameRepository.getById(gameId);
  }
}

export default GetBoardGame;
