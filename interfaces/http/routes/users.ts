import { Router } from "express";
import createUserController from "../controllers/createUserController";
import validateNicknameController from "../controllers/validateNicknameController";
import updateNicknameController from "../controllers/updateNicknameController";
import CreateUser from "../../../application/user/CreateUser";
import ValidateNickname from "../../../application/user/ValidateNickname";
import FetchUserNickname from "../../../application/user/FetchUserNickname";
import AddAvatar from "../../../application/user/AddAvatar";
import { requireAuth } from "../middleware/auth";
import ChangeNickname from "../../../application/user/ChangeNickname";
import DeleteUser from "../../../application/user/DeleteUser";
import deleteUserController from "../controllers/deleteUserController";
import fetchUserNicknameController from "../controllers/fetchUserNicknameController";
import addAvatarController from "../controllers/addAvatarController";
import { uploadAvatar } from "../middleware/uploadAvatar";

export interface UserRoutesDeps {
  createUser: CreateUser;
  validateNickname: ValidateNickname
  updateNickname: ChangeNickname
  deleteUser: DeleteUser
  fetchUserNickname: FetchUserNickname
  addAvatar: AddAvatar
}

export default function userRoutes({ createUser, validateNickname, updateNickname, deleteUser, fetchUserNickname, addAvatar }: UserRoutesDeps): Router {
  const router = Router();

  // Protected routes - require valid JWT token
  router.post("/", requireAuth, createUserController(createUser));
  router.post("/validateNickname", requireAuth, validateNicknameController(validateNickname));
  router.post("/newAvatar", requireAuth, addAvatarController(addAvatar))
  router.patch("/updateNickname", requireAuth, updateNicknameController(updateNickname))
  router.post("/fetchUserNickname", requireAuth, fetchUserNicknameController(fetchUserNickname))
  router.delete("/:auth0_id", requireAuth, deleteUserController(deleteUser))
  return router;
}
