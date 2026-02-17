import express, { Express } from "express";
import path from "path";
import cors from "cors";
import userRoutes from "./routes/users";
import CreateUser from "../../application/user/CreateUser";
import DeleteUser from "../../application/user/DeleteUser";
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
import sessionsRouter from "./routes/sessions";
import sessionPlayerRouter from "./routes/sessionPlayers";
import sessionPlayers from "../../application/sessionPlayer/saveSessionPlayer";
import ChangeNickname from "../../application/user/ChangeNickname";
import AddBoardGameToUser from "../../application/boardgame/AddBoardGameToUser";
import GetUserGameCollection from "../../application/boardgame/GetUserGameCollection";
import getSessions from "../../application/session/GetGameSessions";
import DeleteBoardGame from "../../application/boardgame/DeleteBoardGame";
import UpdateSession from "../../application/session/updateSession";
import AddLocationToSession from "../../application/session/AddLocationToSession";
import CreateSession from "../../application/session/CreateSession";
import FetchUserNickname from "../../application/user/FetchUserNickname";

export interface HttpServerDeps {
  createUser: CreateUser;
  validateNickname: ValidateNickname;
  updateNickname: ChangeNickname;
  findBoardGame: FindBoardGame;
  declineRequest: DeclineRequest;
  getFriends: GetFriends;
  getFriendRequests: GetFriendRequests;
  addFriend: AddFriend;
  acceptRequest: AcceptRequest;
  inviteFriend: InviteFriend;
  addGameToUser: AddBoardGameToUser
  getUserGameCollection: GetUserGameCollection
  getSessions: getSessions;
  saveSessionPlayer: sessionPlayers;
  deleteUser: DeleteUser
  deleteBoardGame: DeleteBoardGame
  updateSession: UpdateSession;
  addLocationToSession: AddLocationToSession;
  createSession: CreateSession;
  fetchUserNickname: FetchUserNickname
} 

export default function createHttpServer(deps: HttpServerDeps): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.use("/users", userRoutes(deps));

  app.use("/boardgames", boardGameRouter(deps));
  app.get("/", (req, res) => {
    res.send("GameKnight API");
  });
  app.use("/friendships", friendshipsRouter(deps))
  app.use("/sessions", sessionsRouter(deps));
  app.use("/sessionPlayers", sessionPlayerRouter(deps));

  return app;
}
