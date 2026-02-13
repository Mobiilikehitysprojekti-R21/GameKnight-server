import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createSessionController } from "../controllers/createSessionController";
import { addLocationToSessionController } from "../controllers/addLocationToSessionController";
import { sessionComposition } from "../../../composition/session";

const router = Router();

router.post(
  "/",
  requireAuth,
  createSessionController(sessionComposition.createSession)
);

router.put(
  "/:id/location",
  requireAuth,
  addLocationToSessionController(sessionComposition.addLocationToSession)
);

export default router;
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
