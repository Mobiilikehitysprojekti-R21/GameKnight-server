import Location from "../../domain/Location";
import { LocationRepository } from "../../ports/LocationRepository";

 class CreateLocation {
  private locationRepository: LocationRepository;

  constructor(locationRepository: LocationRepository) {
    this.locationRepository = locationRepository;
  }

  async execute(locationData: { name: string; latitude: number; longitude: number }): Promise<Location> {
    const location = new Location({
      location_id: 0, 
      name: locationData.name,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    });
    return await this.locationRepository.create(location);
  }
}

export default CreateLocation;