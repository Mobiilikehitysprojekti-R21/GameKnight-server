import type { Friend, FriendInviteResult, FriendRequest, FriendInviteStatus, FriendshipProps } from "../../domain/Friendship";
import type FriendRepository from "../../ports/FriendRepository";

type UserId = number;

export default class InMemoryFriendRepository implements FriendRepository {
  private friends: Map<UserId, Friend[]> = new Map();
  private friendRequests: FriendRequest[] = [];

  async getFriends(user_id: UserId): Promise<Friend[]> {
    return this.friends.get(user_id) || [];
  }

  async addFriend(userId: number, nickname: string): Promise<number> {
    const userFriends = this.friends.get(userId) || [];
    const newFriendId = Date.now(); // Mock friend id generation
    const newFriend: Friend = {
      user_id: newFriendId,
      nickname: nickname
    };
    userFriends.push(newFriend);
    this.friends.set(userId, userFriends);
    return newFriendId;
  }

  async inviteFriend(user_id: UserId, email: string): Promise<FriendInviteResult> {
    const status: FriendInviteStatus = "sent";
    return { email, status };
  }

  async getFriendRequests(user_id: UserId): Promise<FriendRequest[]> {
    return this.friendRequests.filter(req => req.to_user_id === user_id);
  }

  async acceptRequest(request_id: number): Promise<void> {
    const request = this.friendRequests.find(r => r.request_id === request_id);
    if (!request) return;

    // kavereiksi keskenään
    const fromUserFriends = this.friends.get(request.from_user_id) || [];
    const toUserFriends = this.friends.get(request.to_user_id) || [];

    fromUserFriends.push({
      user_id: request.to_user_id,
      nickname: request.to_nickname
    });

    toUserFriends.push({
      user_id: request.from_user_id,
      nickname: request.from_nickname
    });

    this.friends.set(request.from_user_id, fromUserFriends);
    this.friends.set(request.to_user_id, toUserFriends);

    // poista pyyntö
    this.friendRequests = this.friendRequests.filter(r => r.request_id !== request_id);
  }

  async declineRequest(request_id: number): Promise<void> {
    this.friendRequests = this.friendRequests.filter(r => r.request_id !== request_id);
  }

  async findByRequestID(request_id: number): Promise<FriendshipProps | undefined> {
    const req = this.friendRequests.find(r => r.request_id === request_id);
    if (!req) return undefined;
    return {
      request_id: req.request_id,
      user_id: req.from_user_id,
      friend_id: req.to_user_id,
      status: "pending",
      created_at: req.created_at
    };
  }
}