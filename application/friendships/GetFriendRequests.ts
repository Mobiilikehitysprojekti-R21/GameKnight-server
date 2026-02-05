import type { FriendRequest } from "../../domain/Friendship";
import FriendRepository from "../../ports/FriendRepository";

export interface GetFriendRequestsInput {
  userId: number;
}

class GetFriendRequests {
  private readonly friendRepository: FriendRepository;

  constructor(friendRepository: FriendRepository) {
    this.friendRepository = friendRepository;
  }

  async execute(input: GetFriendRequestsInput): Promise<FriendRequest[]> {
    return this.friendRepository.getFriendRequests(input.userId);
  }
}

export default GetFriendRequests;