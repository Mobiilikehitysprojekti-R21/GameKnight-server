import Location from "../../domain/Location";
import UserRepository from "../../ports/UserRepository";

export interface AddFavoriteLocationInput {
  userId: number;
  name?: string;
  latitude: number;
  longitude: number;
}

class AddFavoriteLocation {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(input: AddFavoriteLocationInput): Promise<Location> {
    return this.userRepository.addFavoriteLocation(input.userId, {
      name: input.name,
      latitude: input.latitude,
      longitude: input.longitude,
    });
  }
}

export default AddFavoriteLocation;
