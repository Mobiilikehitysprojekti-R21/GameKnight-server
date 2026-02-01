import { Router } from "express";
import createUserController from "../controllers/createUserController";
import validateNicknameController from "../controllers/validateNicknameController";
import updateNicknameController from "../controllers/updateNicknameController";
import CreateUser from "../../../application/user/CreateUser";
import ValidateNickname from "../../../application/user/ValidateNickname";
import ChangeNickname from "../../../application/user/ChangeNickname";

export interface UserRoutesDeps {
  createUser: CreateUser;
  validateNickname: ValidateNickname
  updateNickname: ChangeNickname
}

export default function userRoutes({ createUser, validateNickname, updateNickname }: UserRoutesDeps): Router {
  const router = Router();

  router.post("/", createUserController(createUser));
  router.post("/validateNickname", validateNicknameController(validateNickname))
  router.patch("/updateNickname", updateNicknameController(updateNickname))

  return router;
}
