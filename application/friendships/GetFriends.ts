import type { Friend } from "../../domain/Friendship";
import FriendRepository from "../../ports/FriendRepository";

export interface GetFriendsInput {
	userId: number;
}

class GetFriends {
	private readonly friendRepository: FriendRepository;

	constructor(friendRepository: FriendRepository) {
		this.friendRepository = friendRepository;
	}

	async execute(input: GetFriendsInput): Promise<Friend[]> {
		return this.friendRepository.getFriends(input.userId);
	}
}

export default GetFriends;
