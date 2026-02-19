import BoardGameRepository from "../../ports/BoardGameRepository";
import BoardGame from "../../domain/BoardGame";
import fs from "fs";
import path from "path";

const BOARDGAMES_CSV_PATH = path.join(__dirname, "..", "..", "boardgames_ranks.csv");

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === "\"") {
      // Handle escaped quotes inside quoted fields
      if (inQuotes && line[i + 1] === "\"") {
        current += "\"";
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function loadBoardGamesFromCsv(): BoardGame[] {
  try {
    const fileContents = fs.readFileSync(BOARDGAMES_CSV_PATH, "utf8");
    const lines = fileContents.split(/\r?\n/).filter((line) => line.trim().length > 0);

    if (lines.length <= 1) {
      return [];
    }

    const header = parseCsvLine(lines[0]);

    const indexOf = (columnName: string) => header.indexOf(columnName);

    const idIndex = indexOf("id");
    const nameIndex = indexOf("name");
    const yearPublishedIndex = indexOf("yearpublished");
    const rankIndex = indexOf("rank");
    const bayesAverageIndex = indexOf("bayesaverage");
    const averageIndex = indexOf("average");
    const usersRatedIndex = indexOf("usersrated");
    const isExpansionIndex = indexOf("is_expansion");

    const games: BoardGame[] = [];

    for (let i = 1; i < lines.length; i++) {
      const columns = parseCsvLine(lines[i]);

      const id = Number(columns[idIndex]);
      if (!Number.isFinite(id)) {
        continue;
      }

      const yearpublished = Number(columns[yearPublishedIndex]);
      const rank = Number(columns[rankIndex]);
      const bayesaverage = Number(columns[bayesAverageIndex]);
      const average = Number(columns[averageIndex]);
      const usersrated = Number(columns[usersRatedIndex]);
      const is_expansion = columns[isExpansionIndex] === "1";

      games.push({
        bgg_id: id,
        name: columns[nameIndex],
        year_published: yearpublished,
        rank,
        bayes_average: bayesaverage,
        average,
        users_rated: usersrated,
        is_expansion,
      });
    }

    return games;
  } catch (error) {
    console.error("Failed to load boardgames_ranks.csv", error);
    return [];
  }
}

// Load once at module initialization and keep in memory
const BOARDGAMES_CACHE: BoardGame[] = loadBoardGamesFromCsv();

class InMemoryBoardGameRepository extends BoardGameRepository {
  private readonly boardGames: BoardGame[] = BOARDGAMES_CACHE;
  private readonly userCollections: Map<string, Set<number>> = new Map();

  async search(query: string): Promise<BoardGame[] | undefined> {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      return this.boardGames;
    }

    return this.boardGames.filter((game) =>
      game.name.toLowerCase().includes(trimmedQuery)
    );
  }

  async getById(gameId: number): Promise<BoardGame | undefined> {
    return this.boardGames.find((game) => game.game_id === gameId);
  }

  async addBoardGameToUser(userId: string, game: BoardGame["bgg_id"]): Promise<BoardGame["bgg_id"]> {
    const existing = this.userCollections.get(userId) ?? new Set<number>();
    existing.add(Number(game));
    this.userCollections.set(userId, existing);
    return game;
  }

  async getUserGameCollection(userId: string): Promise<BoardGame[]> {
    const ids = this.userCollections.get(userId);
    if (!ids || ids.size === 0) return [];
    return this.boardGames.filter((g) => ids.has(g.bgg_id));
  }

  async deleteBoardGame(bgg_id: number, auth0_id: string): Promise<void> {
    const ids = this.userCollections.get(auth0_id);
    if (!ids) return;
    ids.delete(bgg_id);
  }
}

export default InMemoryBoardGameRepository;
