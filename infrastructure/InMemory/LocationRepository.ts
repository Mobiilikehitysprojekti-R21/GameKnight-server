import Location from "../../domain/Location";
import { LocationRepository } from "../../ports/LocationRepository";

export class InMemoryLocationRepository implements LocationRepository {
  private locations: Location[] = [];
  private nextId = 1;

  async create(location: Location): Promise<Location> {
    // Check if location with same coordinates already exists (UPSERT behavior)
    const existing = this.locations.find(
      l => l.latitude === location.latitude && l.longitude === location.longitude
    );

    if (existing) {
      // Update name if provided, otherwise keep existing
      if (location.name) {
        return new Location({
          ...existing,
          name: location.name,
        });
      }
      return existing;
    }

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

export default InMemoryLocationRepository;