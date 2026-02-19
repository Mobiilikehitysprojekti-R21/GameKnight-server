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
            row.year_published ?? undefined,
            row.rank ?? undefined,
            row.bayes_average == null ? undefined : Number(row.bayes_average),
            row.average == null ? undefined : Number(row.average),
            row.users_rated ?? undefined,
            row.thumbnail_url ?? undefined,
        ));
    }

    async getById(gameId: number): Promise<BoardGame | undefined> {
        const result = await this.pool.query(
            `SELECT *
            FROM boardgames
            WHERE game_id = $1`,
            [gameId]
        )

        if (result.rows.length === 0) return undefined;

        const row = result.rows[0];
        return new BoardGame(
            row.bgg_id,
            row.name,
            row.is_expansion,
            row.game_id,
            row.year_published ?? undefined,
            row.rank ?? undefined,
            row.bayes_average == null ? undefined : Number(row.bayes_average),
            row.average == null ? undefined : Number(row.average),
            row.users_rated ?? undefined,
            row.thumbnail_url ?? undefined,
        );
    }

    async addBoardGameToUser(userId: string, game: BoardGame["bgg_id"]): Promise<BoardGame["bgg_id"]> {
        const result = await this.pool.query(
            `INSERT INTO userBoardgames (auth0_id, bgg_id)
            VALUES ($1, $2)
            RETURNING auth0_id, bgg_id`,
            [userId, game]
        )

        if (result.rows.length > 0) {
            const row = result.rows[0]
            return row.bgg_id
        } else {
            throw new Error("Failed to add new game to user´s collection")
        }
    }

    async getUserGameCollection(userId: string) {
        const result = await this.pool.query(
            `SELECT * FROM boardgames b
            JOIN userBoardgames ub ON ub.bgg_id = b.bgg_id
            WHERE ub.auth0_id = $1`,
            [userId]
        )

        return result.rows.map(row => new BoardGame(
            row.bgg_id,
            row.name,
            row.is_expansion,
            row.game_id,
            row.year_published ?? undefined,
            row.rank ?? undefined,
            row.bayes_average == null ? undefined : Number(row.bayes_average),
            row.average == null ? undefined : Number(row.average),
            row.users_rated ?? undefined,
            row.thumbnail_url ?? undefined,
        ));

    }

    // Delete BoardGame from user´s collection
    async deleteBoardGame(bgg_id: number, auth0_id: string) {
        try {
            await this.pool.query(
                `DELETE FROM userBoardgames
                 WHERE bgg_id = $1 AND auth0_id = $2`,
                [bgg_id, auth0_id]
            )
        } catch (e: any) {
            throw new Error("Failed to delete game from collection");
        }
    }


}
export default PostgresBoardGameRepository