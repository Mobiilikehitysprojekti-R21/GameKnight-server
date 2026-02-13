import PostgresLocationRepository from "../infrastructure/postgres/LocationRepository";
import { pool } from "../infrastructure/postgres/db";
import CreateLocation from "../application/location/CreateLocation";
import FindLocationById from "../application/location/FindLocationById";
import { InMemoryLocationRepository } from "../infrastructure/InMemory/LocationRepository";

const locationRepository = new PostgresLocationRepository(pool);

export default function createLocationUseCases() {
  return {
    createLocation: new CreateLocation(locationRepository),
    findLocationById: new FindLocationById(locationRepository),
  };
}

export { createLocationUseCases };