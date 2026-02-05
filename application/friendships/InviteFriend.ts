import type { FriendInviteResult } from "../../domain/Friendship";
import FriendRepository from "../../ports/FriendRepository";

export interface InviteFriendInput {
  userId: number;
  email: string;
}

class InviteFriend {
  private readonly friendRepository: FriendRepository;

  constructor(friendRepository: FriendRepository) {
    this.friendRepository = friendRepository;
  }

  async execute(input: InviteFriendInput): Promise<FriendInviteResult> {
    return await this.friendRepository.inviteFriend(input.userId, input.email);
  }
}

export default InviteFriend;