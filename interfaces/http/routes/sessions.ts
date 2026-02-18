import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createSessionController } from "../controllers/createSessionController";
import { addLocationToSessionController } from "../controllers/addLocationToSessionController";
import getSessionsController from "../controllers/getSessionController";
import { updateSessionController } from "../controllers/updateSessionController";

export interface SessionRoutesDeps {
  getSessions: any;
  updateSession: any;
  addLocationToSession: any;
  createSession: any;
}

export default function sessionsRoutes({ getSessions, updateSession, addLocationToSession, createSession }: SessionRoutesDeps): Router {
  const router = Router();

  router.get("/", requireAuth, getSessionsController(getSessions));
  router.post("/", requireAuth, createSessionController(createSession));
  router.put("/:id/location", requireAuth, addLocationToSessionController(addLocationToSession));
  router.put("/:id", requireAuth, updateSessionController(updateSession));

  return router;
}