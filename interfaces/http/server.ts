import express, { Express } from "express";
import cors from "cors";
import userRoutes from "./routes/users";
import CreateUser from "../../application/user/CreateUser";
import FindBoardGame from "../../application/boardgame/FindBoardGame";
import boardGameRouter from "./routes/boardgames";
import friendshipsRouter from "./routes/friendships";
import ValidateNickname from "../../application/user/ValidateNickname";
import DeclineRequest from "../../application/friendships/DeclineRequest";
import GetFriends from "../../application/friendships/GetFriends"; 
import GetFriendRequests from "../../application/friendships/GetFriendRequests";
import AddFriend from "../../application/friendships/AddFriend";
import AcceptRequest from "../../application/friendships/AcceptRequest";
import InviteFriend from "../../application/friendships/InviteFriend";

export interface HttpServerDeps {
  createUser: CreateUser;
  validateNickname: ValidateNickname
  findBoardGame: FindBoardGame;
  declineRequest: DeclineRequest;
  getFriends: GetFriends;
  getFriendRequests: GetFriendRequests;
  addFriend: AddFriend;
  acceptRequest: AcceptRequest;
  inviteFriend: InviteFriend;
}

export default function createHttpServer(deps: HttpServerDeps): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/users", userRoutes(deps));
  app.use("/boardgames", boardGameRouter(deps))
  app.use("/friendships", friendshipsRouter(deps))

  return app;
}
