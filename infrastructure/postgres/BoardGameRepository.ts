import BoardGame from "../../domain/BoardGame";
import BoardGameRepository from "../../ports/BoardGameRepository";
import { Pool } from "pg";

class PostgresBoardGameRepository extends BoardGameRepository {
    private readonly pool: Pool

    constructor(pool: Pool) {
    super();
    this.pool = pool;
  }

    async search(query: string): Promise<BoardGame[] | undefined> {
        const result = await this.pool.query(
            `SELECT *
            FROM boardgames
            WHERE name ILIKE '%${query}%'`
        )

        return result.rows.map(row => new BoardGame(
            row.game_id,
            row.bgg_id,
            row.name,
            row.year_published,
            row.rank,
            row.bayes_average,
            row.average,
            row.users_rated,
            row.is_expansion
        ));
    }

    // async addGameToUser() {}
}
export default PostgresBoardGameRepository