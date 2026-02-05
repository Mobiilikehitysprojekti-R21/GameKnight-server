import FindBoardGame from "../application/boardgame/FindBoardGame";
import BoardGameRepository from "../infrastructure/InMemory/BoardGameRepository";
import { pool } from "../infrastructure/postgres/db";
import PostgresBoardGameRepository from "../infrastructure/postgres/BoardGameRepository";
import AddBoardGameToUser from "../application/boardgame/AddBoardGameToUser";


module.exports = function createBoardGameUseCases() {
  //const bggApi = new BoardGameRepository();
  const boardgameRepo = new PostgresBoardGameRepository(pool)

  return {
    findBoardGame: new FindBoardGame(boardgameRepo),
    addGameToUser: new AddBoardGameToUser(boardgameRepo)
  };
};