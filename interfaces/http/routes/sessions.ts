import { Router } from "express";
import { requireAuth, optionalAuth } from "../middleware/auth";
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
  userRepository: any;
}

export default function sessionsRoutes({
  getSessions,
  getSessionById,
  getSessionsByUserId,
  updateSession,
  addLocationToSession,
  createSession,
  userRepository,
}: SessionRoutesDeps): Router {
  const router = Router();

  router.get("/", optionalAuth, getSessionsController(getSessions, getSessionsByUserId, userRepository));
  router.get("/user/:user_id", requireAuth, getSessionsByUserIdController(getSessionsByUserId));
  router.get("/:id", requireAuth, getSessionByIdController(getSessionById));

  router.post("/", requireAuth, createSessionController(createSession, userRepository));
  router.put("/:id/location", requireAuth, addLocationToSessionController(addLocationToSession));
  router.put("/:id", requireAuth, updateSessionController(updateSession));

  return router;
}
