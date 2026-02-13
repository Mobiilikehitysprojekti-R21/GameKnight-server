import { Router } from "express";
import sessionPlayers from "../../../application/sessionPlayer/saveSessionPlayer";
import saveSessionPlayerController from "../controllers/saveSessionPlayerController";

export interface SessionPlayerRoutesDeps {
    saveSessionPlayer: sessionPlayers;
}

export default function sessionPlayerRoutes({ saveSessionPlayer }: SessionPlayerRoutesDeps): Router {
  const router = Router();
  
  router.post("/", saveSessionPlayerController(saveSessionPlayer));

  return router;
}
