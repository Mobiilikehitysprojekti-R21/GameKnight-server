import UserRepository from "../../ports/UserRepository";
import User from "../../domain/User";
import Location from "../../domain/Location";
import { Pool } from "pg";

class PostgresUserRepository extends UserRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    super();
    this.pool = pool;
  }

  // INSERT user
  async save(user: User): Promise<User> {
    const result = await this.pool.query(
      `INSERT INTO users (email, auth0_id, nickname)
       VALUES ($1, $2, $3)
       RETURNING user_id, auth0_id, email, nickname`,
      [user.email, user.auth0_id, user.nickname]
    );
    if (result.rows.length > 0) {
      const row = result.rows[0];
      return new User({
        user_id: row.user_id,
        email: row.email,
        auth0_id: row.auth0_id,
        nickname: row.nickname,
        avatar_url: row.avatar_url
      });
    } else {
      throw new Error("Failed to insert user");
    }
  }

  // FIND user by email
  async findByEmail(email: string): Promise<User | undefined> {
    const result = await this.pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (result.rowCount === 0) return undefined;

    const row = result.rows[0];

    return new User({
      user_id: row.user_id,
      email: row.email,
      auth0_id: row.auth0_id,
      nickname: row.nickname,
      avatar_url: row.avatar_url
    });
  }

  // FIND user by id
  async findById(auth0_id: string): Promise<User | undefined> {
    const result = await this.pool.query(
      `SELECT * FROM users WHERE auth0_id = $1`,
      [auth0_id]
    );

    if (result.rowCount === 0) return undefined;

    const row = result.rows[0];

    return new User({
      user_id: row.user_id,
      email: row.email,
      auth0_id: row.auth0_id,
      nickname: row.nickname,
      avatar_url: row.avatar_url
    });
  }

  // FIND user by nickname
  async findByNickname(nickname: string): Promise<User | undefined> {
    const result = await this.pool.query(
      `SELECT * FROM users WHERE nickname = $1`,
      [nickname]
    );

    if (result.rowCount === 0) return undefined;

    const row = result.rows[0];

    return new User({
      user_id: row.user_id,
      email: row.email,
      auth0_id: row.auth0_id,
      nickname: row.nickname,
      avatar_url: row.avatar_url
    });
  }

  // UPDATE nickname
  async updateNickname(nickname: string, auth0_id: string): Promise<User> {

    const result = await this.pool.query(
      ` UPDATE users 
        SET nickname = $1
        WHERE auth0_id = $2
        RETURNING user_id, auth0_id, email, nickname
      `,
      [nickname, auth0_id]
    )
    if (result.rows.length > 0) {
      const row = result.rows[0]
      return new User({
        user_id: row.user_id,
        email: row.email,
        auth0_id: row.auth0_id,
        nickname: row.nickname,
        avatar_url: row.avatar_url
      });
    } else {
      throw new Error("Failed to update nickname");
    }
  }

  // ADD new profile picture
  async addAvatarUrl(avatar_url: string, auth0_id: string): Promise<String> {
    
    try {
    const result = await this.pool.query(
      `UPDATE users
       SET avatar_url = $1
       WHERE auth0_id = $2
       RETURNING avatar_url`,
      [avatar_url, auth0_id]
    );

    if (result.rowCount === 0) {
      throw new Error("User not found");
    }

    return result.rows[0].avatar_url;
  } catch (e: any) {
    throw new Error("Failed to add new avatar url");
  }
}
// Function to fetch user's nickname (and more)
// Despite the name all user data is returned
  async fetchUserNickname(auth0_id: string): Promise<User> {

    const result = await this.pool.query(
      ` SELECT * FROM users 
        WHERE auth0_id = $1
        RETURNING user_id, auth0_id, email, nickname
      `,
      [auth0_id]
    )

    if (result.rows.length > 0) {
      const row = result.rows[0]
      return new User({
        user_id: row.user_id,
        email: row.email,
        auth0_id: row.auth0_id,
        nickname: row.nickname,
        avatar_url: row.avatar_url
      });
    } else {
      throw new Error("Failed to update nickname");
    }
  }

  // DELETE user
  async deleteUser(auth0_id: string): Promise<void> {

    try {
      await this.pool.query(
      ` DELETE FROM users 
        WHERE auth0_id = $1
      `,
      [auth0_id]
    )

    } catch (e: any) {
      throw new Error("Failed to delete user");
    }
    
  }

  async getFavoriteLocations(user_id: number): Promise<Location[]> {
    const result = await this.pool.query(
      `SELECT l.location_id, l.name, l.latitude, l.longitude
       FROM user_favorite_locations ufl
       JOIN locations l ON l.location_id = ufl.location_id
       WHERE ufl.user_id = $1
       ORDER BY ufl.created_at DESC`,
      [user_id]
    );

    return result.rows.map((row) => new Location(row));
  }

  async addFavoriteLocation(
    user_id: number,
    location: { name?: string; latitude: number; longitude: number }
  ): Promise<Location> {
    // Round to 6 decimal places (~0.1m precision) to avoid floating point duplicates
    const lat = Math.round(location.latitude * 1000000) / 1000000;
    const lng = Math.round(location.longitude * 1000000) / 1000000;

    // Generate default name if not provided
    const locationName = location.name ?? `Favorite Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`;

    // UPSERT location - create if doesn't exist, otherwise do nothing
    const locationResult = await this.pool.query(
      `INSERT INTO locations (name, latitude, longitude)
       VALUES ($1, $2, $3)
       ON CONFLICT (latitude, longitude) DO UPDATE SET name = COALESCE(NULLIF($1, NULL), locations.name)
       RETURNING location_id, name, latitude, longitude`,
      [locationName, lat, lng]
    );

    const locationId = locationResult.rows[0].location_id as number;

    // Add to user's favorites (if not already there)
    await this.pool.query(
      `INSERT INTO user_favorite_locations (user_id, location_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, location_id) DO NOTHING`,
      [user_id, locationId]
    );

    return new Location(locationResult.rows[0]);
  }

}

export default PostgresUserRepository;
