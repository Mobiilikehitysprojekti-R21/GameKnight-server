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
