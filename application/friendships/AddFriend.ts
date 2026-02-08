import FriendRepository from "../../ports/FriendRepository";

export interface AddFriendInput {
  userId: number;
  nickname: string;
}

class AddFriend {
  private readonly friendRepository: FriendRepository;

  constructor(friendRepository: FriendRepository) {
    this.friendRepository = friendRepository;
  }

  async execute(input: AddFriendInput): Promise<number> {
    return this.friendRepository.addFriend(input.userId, input.nickname);
  }
}

export default AddFriend;