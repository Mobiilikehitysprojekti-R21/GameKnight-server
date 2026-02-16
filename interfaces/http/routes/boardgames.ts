import { Router } from "express";
import FindBoardgame from "../../../application/boardgame/FindBoardGame";
import findBoardGameController from "../controllers/findBoardGameController";
import addBoardGameToUserController from "../controllers/addBoardGameToUserController";
import getUserGameCollectionController from "../controllers/getUserGameCollectionController";
import deleteBoardGameController from "../controllers/deleteBoardGameController";
import AddBoardGameToUser from "../../../application/boardgame/AddBoardGameToUser";
import GetUserGameCollection from "../../../application/boardgame/GetUserGameCollection";
import DeleteBoardGame from "../../../application/boardgame/DeleteBoardGame";
import { optionalAuth, requireAuth } from "../middleware/auth";

export interface BoardGameRoutesDeps {
  findBoardGame: FindBoardgame;
  addGameToUser: AddBoardGameToUser
  getUserGameCollection: GetUserGameCollection
  deleteBoardGame: DeleteBoardGame
}

export default function userRoutes({ findBoardGame, addGameToUser, getUserGameCollection, deleteBoardGame }: BoardGameRoutesDeps): Router {
  const router = Router();

  router.get("/findByName", requireAuth, findBoardGameController(findBoardGame));
  router.get("/getUserGameCollection/:user_id", requireAuth, getUserGameCollectionController(getUserGameCollection))
  router.post("/addToUser", requireAuth, addBoardGameToUserController(addGameToUser))
  router.delete("/:auth0_id/:bgg_id", requireAuth, deleteBoardGameController(deleteBoardGame))

  return router;
}
