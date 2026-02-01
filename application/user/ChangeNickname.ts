import User from "../../domain/User";
import UserRepository from "../../ports/UserRepository";

export interface ValidateNicknameInput {
  nickname: string
  auth0_id: string
  email: string
  user_id: string
}

class ChangeNickname {
    private readonly userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    async execute(input: ValidateNicknameInput): Promise<User> {
        const newNickname = await this.userRepository.updateNickname(input.nickname, input.auth0_id)
        return newNickname
    }
}

export default ChangeNickname