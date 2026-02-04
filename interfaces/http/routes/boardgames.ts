import { Router } from "express";
import FindBoardgame from "../../../application/boardgame/FindBoardGame";
import findBoardGameController from "../controllers/findBoardGameController";

export interface BoardGameRoutesDeps {
    findBoardGame: FindBoardgame;
}

export default function userRoutes({ findBoardGame }: BoardGameRoutesDeps): Router {
  const router = Router();
  
  router.get("/findByName", findBoardGameController(findBoardGame));

  return router;
}
