import InviteFriend from "../application/friendships/InviteFriend";
import GetFriends from "../application/friendships/GetFriends";
import GetFriendRequests from "../application/friendships/GetFriendRequests";
import AddFriend from "../application/friendships/AddFriend";
import AcceptRequest from "../application/friendships/AcceptRequest";
import DeclineRequest from "../application/friendships/DeclineRequest";
// import InMemoryFriendRepository from "../infrastructure/InMemory/FriendRepository";
import PostgresFriendRepository from "../infrastructure/postgres/FriendRepository";
import { pool } from "../infrastructure/postgres/db";

module.exports = function createFriendshipUseCases() {
 //  const friendRepo = new InMemoryFriendRepository();
   const friendRepo = new PostgresFriendRepository(pool);

  return {
    inviteFriend: new InviteFriend(friendRepo),
    getFriends: new GetFriends(friendRepo),
    getFriendRequests: new GetFriendRequests(friendRepo),
    addFriend: new AddFriend(friendRepo),
    acceptRequest: new AcceptRequest(friendRepo),
    declineRequest: new DeclineRequest(friendRepo),
  };
};