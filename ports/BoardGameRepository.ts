import BoardGame from "../domain/BoardGame";

abstract class BoardGameRepository {
  abstract search(query: string): Promise<BoardGame[] | undefined>;
  abstract getById(gameId: number): Promise<BoardGame | undefined>;
  abstract addBoardGameToUser(userId: string, game: BoardGame["bgg_id"]): Promise<BoardGame["bgg_id"]>
  abstract getUserGameCollection(userId: string): Promise<BoardGame[]>
  abstract deleteBoardGame(bgg_id: number, auth0_id: string): Promise<void>
}

export default BoardGameRepository;
