import User from "../../domain/User";
import UserRepository from "../../ports/UserRepository";

export interface DeleteUserInput {
  auth0_id: string
}

class DeleteUser {
    private readonly userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    async execute(input: DeleteUserInput): Promise<void> {
        await this.userRepository.deleteUser(input.auth0_id)
    }
}

export default DeleteUser