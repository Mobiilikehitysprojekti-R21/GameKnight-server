import { Router } from "express";
import FindBoardgame from "../../../application/boardgame/FindBoardGame";
import findBoardGameController from "../controllers/findBoardGameController";
import addBoardGameToUserController from "../controllers/addBoardGameToUserController";
import AddBoardGameToUser from "../../../application/boardgame/AddBoardGameToUser";

export interface BoardGameRoutesDeps {
    findBoardGame: FindBoardgame;
    addGameToUser: AddBoardGameToUser
}

export default function userRoutes({ findBoardGame, addGameToUser }: BoardGameRoutesDeps): Router {
  const router = Router();
  
  router.get("/findByName", findBoardGameController(findBoardGame));
  router.post("/addToUser", addBoardGameToUserController(addGameToUser))

  return router;
}
