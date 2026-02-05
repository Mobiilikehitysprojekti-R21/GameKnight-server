import BoardGame from "../domain/BoardGame";

abstract class BoardGameRepository {
  abstract search(query: string): Promise<BoardGame[] | undefined>;
  abstract addBoardGameToUser(userId: number, game: BoardGame["bgg_id"]): Promise<BoardGame["bgg_id"]>
}

export default BoardGameRepository;
