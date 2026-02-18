import { Router } from "express";
import createUserController from "../controllers/createUserController";
import validateNicknameController from "../controllers/validateNicknameController";
import updateNicknameController from "../controllers/updateNicknameController";
import CreateUser from "../../../application/user/CreateUser";
import ValidateNickname from "../../../application/user/ValidateNickname";
import FetchUserNickname from "../../../application/user/FetchUserNickname";
import { requireAuth } from "../middleware/auth";
import ChangeNickname from "../../../application/user/ChangeNickname";
import DeleteUser from "../../../application/user/DeleteUser";
import deleteUserController from "../controllers/deleteUserController";
import fetchUserNicknameController from "../controllers/fetchUserNicknameController";

export interface UserRoutesDeps {
  createUser: CreateUser;
  validateNickname: ValidateNickname
  updateNickname: ChangeNickname
  deleteUser: DeleteUser
  fetchUserNickname: FetchUserNickname
}

export default function userRoutes({ createUser, validateNickname, updateNickname, deleteUser, fetchUserNickname }: UserRoutesDeps): Router {
  const router = Router();

  // Protected routes - require valid JWT token
  router.post("/", requireAuth, createUserController(createUser));
  router.post("/validateNickname", requireAuth, validateNicknameController(validateNickname));
  router.patch("/updateNickname", requireAuth, updateNicknameController(updateNickname))
  router.post("/fetchUserNickname", requireAuth, fetchUserNicknameController(fetchUserNickname))
  router.delete("/:auth0_id", requireAuth, deleteUserController(deleteUser))
  return router;
}
