import { Pool } from "pg";
import Location from "../../domain/Location";
import { LocationRepository as ILocationRepository } from "../../ports/LocationRepository";

export default class LocationRepository implements ILocationRepository {
  constructor(private pool: Pool) {}

  async create(location: Location): Promise<Location> {
    const result = await this.pool.query(
      `
      INSERT INTO locations (name, latitude, longitude)
      VALUES ($1, $2, $3)
      RETURNING location_id, name, latitude, longitude
      `,
      [location.name, location.latitude, location.longitude]
    );

    return new Location(result.rows[0]);
  }

  async findById(id: number): Promise<Location | null> {
    const result = await this.pool.query(
      `
      SELECT location_id, name, latitude, longitude
      FROM locations
      WHERE location_id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) return null;

    return new Location(result.rows[0]);
  }
}
