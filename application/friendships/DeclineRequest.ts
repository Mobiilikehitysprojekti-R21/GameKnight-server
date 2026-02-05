import type { FriendRequest } from "../../domain/Friendship";
import FriendRepository from "../../ports/FriendRepository";

export interface DeclineRequestInput {
  userId: number;
  requestId: number;
}

class DeclineRequest {
  private readonly friendRepository: FriendRepository;

  constructor(friendRepository: FriendRepository) {
    this.friendRepository = friendRepository;
  }

   async execute(input: DeclineRequestInput): Promise<FriendRequest[]> {
    const result = await this.friendRepository.declineRequest(input.userId, input.requestId);

    if (!Array.isArray(result)) {
      throw new Error("declineRequest did not return a FriendRequest[]");
    }
    return result;
  }
}

export default DeclineRequest;