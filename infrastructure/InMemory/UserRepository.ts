import UserRepository from "../../ports/UserRepository";
import User from "../../domain/User";
import Location from "../../domain/Location";

class InMemoryUserRepository extends UserRepository {
  private readonly users: User[] = [];
  private readonly favoriteLocations: Map<number, Location[]> = new Map();
  private serial = 0;

  async save(user: User): Promise<User> {
    this.serial++;
    const userWithId = new User({
      user_id: this.serial,
      email: user.email,
      auth0_id: user.auth0_id,
      nickname: user.nickname,
    });
    this.users.push(userWithId);
    return userWithId;
  }

  async updateNickname(nickname: string, auth0_id: string): Promise<User> {
    const user = this.users.find(u => u.auth0_id === auth0_id);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = new User({
      ...user,
      nickname
    });

    const index = this.users.findIndex(u => u.auth0_id === auth0_id);
    this.users[index] = updatedUser;

    return updatedUser;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async findByNickname(nickname: string): Promise<User | undefined> {
    return this.users.find((u) => u.nickname === nickname);
  }

  async getFavoriteLocations(user_id: number): Promise<Location[]> {
    return this.favoriteLocations.get(user_id) ?? [];
  }

  async addFavoriteLocation(
    user_id: number,
    location: { name: string; latitude: number; longitude: number }
  ): Promise<void> {
    const existing = this.favoriteLocations.get(user_id) ?? [];

    const alreadyExists = existing.some(
      (l) =>
        l.latitude === location.latitude &&
        l.longitude === location.longitude
    );

    if (alreadyExists) return;

    const newLocation = new Location({
      location_id: existing.length + 1,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
    });

    this.favoriteLocations.set(user_id, [...existing, newLocation]);
  }
}

export default InMemoryUserRepository;
