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

   async execute(input: DeclineRequestInput): Promise<void> {
    await this.friendRepository.declineRequest(input.userId, input.requestId);
  }
}

export default DeclineRequest;