import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createSessionController } from "../controllers/createSessionController";
import { addLocationToSessionController } from "../controllers/addLocationToSessionController";
import getSessionsController from "../controllers/getSessionController";
import { updateSessionController } from "../controllers/updateSessionController";
import getSessionByIdController from "../controllers/getSessionByIdController";
import getSessionsByUserIdController from "../controllers/getSessionsByUserIdController";
import GetSessionById from "../../../application/session/GetSessionById";
import GetSessionsByUserId from "../../../application/session/GetSessionsByUserId";

export interface SessionRoutesDeps {
  getSessions: any;
  getSessionById: GetSessionById;
  getSessionsByUserId: GetSessionsByUserId;
  updateSession: any;
  addLocationToSession: any;
  createSession: any;
}

export default function sessionsRoutes({
  getSessions,
  getSessionById,
  getSessionsByUserId,
  updateSession,
  addLocationToSession,
  createSession,
}: SessionRoutesDeps): Router {
  const router = Router();

  router.get("/", requireAuth, getSessionsController(getSessions));
  router.get("/user/:user_id", requireAuth, getSessionsByUserIdController(getSessionsByUserId));
  router.get("/:id", requireAuth, getSessionByIdController(getSessionById));

  router.post("/", requireAuth, createSessionController(createSession));
  router.put("/:id/location", requireAuth, addLocationToSessionController(addLocationToSession));
  router.put("/:id", requireAuth, updateSessionController(updateSession));

  return router;
}
