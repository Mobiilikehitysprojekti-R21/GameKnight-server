import User from "../../domain/User";
import UserRepository from "../../ports/UserRepository";

export interface FetchUserNicknameInput {
  auth0_id: string
}

class FetchUserNickname {
    private readonly userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    async execute(input: FetchUserNicknameInput): Promise<User> {
        const userNickname = await this.userRepository.findById(input.auth0_id)
        if (!userNickname) {
            throw new Error(`User with auth0_id ${input.auth0_id} not found`)
        }
        return userNickname
    }
}

export default FetchUserNickname