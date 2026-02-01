import User from "../../domain/User";
import UserRepository from "../../ports/UserRepository";

export interface ChangeNicknameInput {
  nickname: string
  auth0_id: string
}

class ChangeNickname {
    private readonly userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    async execute(input: ChangeNicknameInput): Promise<User> {
        const newNickname = await this.userRepository.updateNickname(input.nickname, input.auth0_id)
        return newNickname
    }
}

export default ChangeNickname