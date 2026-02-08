import { Router, Request } from "express";
import inviteFriendController from "../controllers/inviteFriendController";
import getFriendsController from "../controllers/getFriendsController";
import getFriendRequestsController from "../controllers/getFriendRequestsController";
import addFriendController from "../controllers/addFriendController";
import acceptRequestController from "../controllers/acceptRequestController";
import declineFriendRequestController from "../controllers/declineFriendRequestController";

// Extend Express Request interface to include 'user'
declare module 'express-serve-static-core' {
    interface Request {
        user?: { id: string };
    }
}

import InviteFriend from "../../../application/friendships/InviteFriend";
import GetFriends from "../../../application/friendships/GetFriends";
import GetFriendRequests from "../../../application/friendships/GetFriendRequests";
import AddFriend from "../../../application/friendships/AddFriend";
import AcceptRequest from "../../../application/friendships/AcceptRequest";
import DeclineRequest from "../../../application/friendships/DeclineRequest";

function asyncHandler<T extends (...args: any[]) => Promise<any>>(fn: T) {
    return function (req: Request, res: any, next: any) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

export interface FriendshipsRoutesDeps {
    inviteFriend: InviteFriend;
    getFriends: GetFriends;
    getFriendRequests: GetFriendRequests;
    addFriend: AddFriend;
    acceptRequest: AcceptRequest;
    declineRequest: DeclineRequest;
}

export default function friendshipsRoutes({ inviteFriend, getFriends, getFriendRequests, addFriend, acceptRequest, declineRequest }: FriendshipsRoutesDeps): Router {
    const router = Router();
    // Mock authentication
    router.use((req, res, next) => {
        req.user = { id: '1' };
        next();
    });
    router.get("/", asyncHandler(getFriendsController(getFriends))); // GET /friendships
    router.post("/", asyncHandler(addFriendController(addFriend))); // POST /friendships
    router.post("/invite", asyncHandler(inviteFriendController(inviteFriend))); // POST /friendships/invite
    router.get("/requests", asyncHandler(getFriendRequestsController(getFriendRequests))); // GET /friendships/requests
    router.post("/requests/accept", asyncHandler(acceptRequestController(acceptRequest))); // POST /friendships/requests/accept
    router.post("/requests/decline", asyncHandler(declineFriendRequestController(declineRequest))); // POST /friendships/requests/decline

    return router;
}
