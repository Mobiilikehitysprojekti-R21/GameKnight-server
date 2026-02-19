import User from "../domain/User";
import Location from "../domain/Location";

abstract class UserRepository {
  abstract save(user: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract findById(auth0_id: string): Promise<User | undefined>
  abstract findByNickname(nickname: string): Promise<User | undefined>;
  abstract updateNickname(nickname: string, auth0_id: string): Promise<User>
  abstract deleteUser(auth0_id: string):Promise<void>
  abstract addAvatarUrl(avatar_url: string, auth0_id: string): Promise<String>
  abstract getFavoriteLocations(user_id: number): Promise<Location[]>;
  abstract addFavoriteLocation(
    user_id: number,
    location: { name?: string; latitude: number; longitude: number }
  ): Promise<Location>;
}

export default UserRepository;
