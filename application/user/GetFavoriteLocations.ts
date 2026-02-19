import Location from "../../domain/Location";
import UserRepository from "../../ports/UserRepository";

export interface GetFavoriteLocationsInput {
  userId: number;
}

class GetFavoriteLocations {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(input: GetFavoriteLocationsInput): Promise<Location[]> {
    return this.userRepository.getFavoriteLocations(input.userId);
  }
}

export default GetFavoriteLocations;
