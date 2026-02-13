import User from "../../domain/User";
import UserRepository from "../../ports/UserRepository";

export interface CreateUserInput {
  email: string;
  auth0_id: string;
  nickname: string;
}

class CreateUser {
  /** userRepository is port that describes infrastructure holding user data.
   * This is selected in server.ts
   * `const createUser = new CreateUser(userRepo)`
   * Here userRepo can be any implemented repository, for example
   * infrastructure/InMemory/UserRepository.ts
   * or
   * infrastructure/postgres/UserRepository.ts
   */
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(input: CreateUserInput): Promise<User> {

    const existingNick = await this.userRepository.findByNickname(input.nickname);
    if (existingNick) {
      const error = new Error("Nickname already exists");
      (error as any).statusCode = 409;
      throw error;
    }

    const existingEmail = await this.userRepository.findByEmail(input.email);
    if (existingEmail) {
      const error = new Error("Email already exists");
      (error as any).statusCode = 409;
      throw error;
    }

    const existingId = await this.userRepository.findById(input.auth0_id)
    if (existingId) {
      const error = new Error("Auth0 ID already exists");
      (error as any).statusCode = 409;
      throw error;
    }

    const user = new User(input);
    const saved = await this.userRepository.save(user);

    return saved;
  }
}

export default CreateUser;
