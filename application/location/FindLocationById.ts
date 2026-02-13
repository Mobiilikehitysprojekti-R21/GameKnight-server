import Location from "../../domain/Location";
import { LocationRepository } from "../../ports/LocationRepository";

class FindLocationById {
  private locationRepository: LocationRepository;

  constructor(locationRepository: LocationRepository) {
    this.locationRepository = locationRepository;
  }

  async execute(id: number): Promise<Location | null> {
    return await this.locationRepository.findById(id);
  }
}

export default FindLocationById;