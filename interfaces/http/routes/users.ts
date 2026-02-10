import { Router } from "express";
import createUserController from "../controllers/createUserController";
import validateNicknameController from "../controllers/validateNicknameController";
import updateNicknameController from "../controllers/updateNicknameController";
import CreateUser from "../../../application/user/CreateUser";
import ValidateNickname from "../../../application/user/ValidateNickname";
import { requireAuth } from "../middleware/auth";
import ChangeNickname from "../../../application/user/ChangeNickname";

export interface UserRoutesDeps {
  createUser: CreateUser;
  validateNickname: ValidateNickname
  updateNickname: ChangeNickname
}

export default function userRoutes({ createUser, validateNickname, updateNickname }: UserRoutesDeps): Router {
  const router = Router();

  // Protected routes - require valid JWT token
  router.post("/", requireAuth, createUserController(createUser));
  router.post("/validateNickname", requireAuth, validateNicknameController(validateNickname));
  router.patch("/updateNickname", requireAuth, updateNicknameController(updateNickname))

  return router;
}
