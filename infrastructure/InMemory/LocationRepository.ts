import Location from "../../domain/Location";
import { LocationRepository as ILocationRepository } from "../../ports/LocationRepository";

export class InMemoryLocationRepository implements ILocationRepository {
  private locations: Location[] = [];
  private nextId = 1;

  async create(location: Location): Promise<Location> {
    const newLocation = new Location({
      ...location,
      location_id: this.nextId++,
    });

    this.locations.push(newLocation);
    return newLocation;
  }

  async findById(id: number): Promise<Location | null> {
    const location = this.locations.find(l => l.location_id === id);
    return location ?? null;
  }
}
