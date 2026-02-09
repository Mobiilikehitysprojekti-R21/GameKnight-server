import { Router } from "express";
import sessions from "../../../application/session/getSessions";
import getSessionsController from "../controllers/getSessionController";
import addSession from "../../../application/session/addSession";
import addSessionController from "../controllers/addSessionController";

export interface SessionRoutesDeps {
    getSessions: sessions;
    addSession: addSession;
}

export default function sessionsRoutes({ getSessions, addSession }: SessionRoutesDeps): Router {
  const router = Router();
  
  router.get("/", getSessionsController(getSessions));
  router.post("/", addSessionController(addSession));

  return router;
}
