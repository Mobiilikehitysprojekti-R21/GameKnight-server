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

   async execute(input: AcceptRequestInput): Promise<FriendRequest[]> {
    const result = await this.friendRepository.acceptRequest(input.userId, input.requestId);

    if (!Array.isArray(result)) {
      throw new Error("acceptRequest did not return a FriendRequest[]");
    }
    return result;
  }
}

export default AcceptRequest;