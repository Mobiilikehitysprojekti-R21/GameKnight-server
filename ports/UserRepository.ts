import User from "../domain/User";

abstract class UserRepository {
  abstract save(user: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract findById(auth0_id: string): Promise<User | undefined>
  abstract findByNickname(nickname: string): Promise<User | undefined>;
  abstract updateNickname(nickname: string, auth0_id: string): Promise<User>
  abstract deleteUser(auth0_id: string):Promise<void>
  abstract addAvatarUrl(avatar_url: string, auth0_id: string): Promise<String>
}

export default UserRepository;
