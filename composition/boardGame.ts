import FindBoardGame from "../application/boardgame/FindBoardGame";
import GetBoardGame from "../application/boardgame/GetBoardGame";
import BoardGameRepository from "../infrastructure/InMemory/BoardGameRepository";
import { pool } from "../infrastructure/postgres/db";
import PostgresBoardGameRepository from "../infrastructure/postgres/BoardGameRepository";
import AddBoardGameToUser from "../application/boardgame/AddBoardGameToUser";
import GetUserGameCollection from "../application/boardgame/GetUserGameCollection";
import DeleteBoardGame from "../application/boardgame/DeleteBoardGame";


module.exports = function createBoardGameUseCases() {
  //const bggApi = new BoardGameRepository();
  const boardgameRepo = new PostgresBoardGameRepository(pool)

  return {
    findBoardGame: new FindBoardGame(boardgameRepo),
    getBoardGame: new GetBoardGame(boardgameRepo),
    addGameToUser: new AddBoardGameToUser(boardgameRepo),
    getUserGameCollection: new GetUserGameCollection(boardgameRepo),
    deleteBoardGame: new DeleteBoardGame(boardgameRepo)
  };
};