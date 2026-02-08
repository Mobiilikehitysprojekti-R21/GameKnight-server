import BoardGame from "../../domain/BoardGame";
import BoardGameRepository from "../../ports/BoardGameRepository";
import { Pool } from "pg";

class PostgresBoardGameRepository extends BoardGameRepository {
    private readonly pool: Pool

    constructor(pool: Pool) {
    super();
    this.pool = pool;
  }

    async search(query: string): Promise<BoardGame[]> {
        const result = await this.pool.query(
            `SELECT *
            FROM boardgames
            WHERE name ILIKE $1`,
            [`%${query}%`]
        )

        return result.rows.map(row => new BoardGame(
            
            row.bgg_id,
            row.name,
            row.is_expansion,
            row.game_id,
            row.year_published,
            row.rank,
            row.bayes_average,
            row.average,
            row.users_rated,
            
        ));
    }

    async addBoardGameToUser(userId: number, game: BoardGame["bgg_id"]): Promise<BoardGame["bgg_id"]> {

        const result = await this.pool.query(
            `INSERT INTO userBoardgames (user_id, bgg_id)
            VALUES ($1, $2)
            RETURNING user_id, bgg_id`,
            [userId, game]
        )

        if (result.rows.length > 0) {
            const row = result.rows[0]
            return row.bgg_id
        } else {
            throw new Error("Failed to add new game to user´s collection")
        }
    }

    async getUserGameCollection(userId: number) {
        const result = await this.pool.query(
            `SELECT * FROM boardgames b
            JOIN userBoardgames ub ON ub.bgg_id = b.bgg_id
            WHERE ub.user_id = $1`,
            [userId]
        )

        return result.rows.map(row => new BoardGame(
            
            row.bgg_id,
            row.name,
            row.is_expansion,
            row.game_id,
            row.year_published,
            row.rank,
            row.bayes_average,
            row.average,
            row.users_rated,
            
        ));

    }
}
export default PostgresBoardGameRepository