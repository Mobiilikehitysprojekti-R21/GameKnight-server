import User from "../../domain/User";
import UserRepository from "../../ports/UserRepository";

export interface AddAvatarInput {
  auth0_id: string
  avatar_url: string
}

class AddAvatar {

    private readonly userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    async execute(input: AddAvatarInput): Promise<void> {
        //const avatar_url = await this.userRepository.addAvatarUrl(input.avatar_url, input.auth0_id)
    }

}

export default AddAvatar