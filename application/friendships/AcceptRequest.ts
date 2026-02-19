import type { FriendRequest } from "../../domain/Friendship";
import FriendRepository from "../../ports/FriendRepository";

export interface AcceptRequestInput {
  userId: number;
  requestId: number;
}

class AcceptRequest {
  private readonly friendRepository: FriendRepository;

  constructor(friendRepository: FriendRepository) {
    this.friendRepository = friendRepository;
  }

   async execute(input: AcceptRequestInput): Promise<void> {
    await this.friendRepository.acceptRequest(input.userId, input.requestId);
  }
}

export default AcceptRequest;