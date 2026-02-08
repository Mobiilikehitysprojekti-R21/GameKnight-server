import type Friendship from "../domain/Friendship";
import type { Friend, FriendRequest, FriendInviteResult } from "../domain/Friendship";

abstract class FriendRepository {
  abstract getFriends(userId: number): Promise<Friend[]>;

  abstract addFriend(userId: number, nickname: string): Promise<number>;
  abstract inviteFriend(userId: number, email: string): Promise<FriendInviteResult>;

  abstract getFriendRequests(userId: number): Promise<FriendRequest[]>;
  abstract acceptRequest(userId: number, requestId: number): Promise<void>;
  abstract declineRequest(userId: number, requestId: number): Promise<void>;

  abstract findByRequestID(requestId: number): Promise<Friendship | undefined>;
}

export default FriendRepository;
