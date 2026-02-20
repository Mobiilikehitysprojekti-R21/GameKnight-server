import { Pool } from "pg";
import Location from "../../domain/Location";
import { LocationRepository } from "../../ports/LocationRepository";

class PostgresLocationRepository implements LocationRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool
  }

  async create(location: Location): Promise<Location> {
    const result = await this.pool.query(
      `INSERT INTO locations (name, latitude, longitude)
      VALUES ($1, $2, $3)
      ON CONFLICT (latitude, longitude) DO UPDATE SET name = COALESCE($1, name)
      RETURNING location_id, name, latitude, longitude`,
      [location.name, location.latitude, location.longitude]
    );

    return new Location(result.rows[0]);
  }

  async findById(id: number): Promise<Location | null> {
    const result = await this.pool.query(
      
      `SELECT location_id, name, latitude, longitude
      FROM locations
      WHERE location_id = $1`,
      [id]
    );

    if (result.rows.length === 0) return null;

    return new Location(result.rows[0]);
  }
}

export default PostgresLocationRepository;