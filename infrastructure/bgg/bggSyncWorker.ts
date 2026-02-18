import { Pool } from "pg";
import { BggXmlApi2Client, parseDurationToMs } from "./BggXmlApi2Client";

function isNonEmptyString(s: string | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

export function startBggSyncWorker(pool: Pool): { stop: () => void } {
  const token = process.env.BGG_ACCESS_TOKEN;
  if (!isNonEmptyString(token)) {
    console.log("⚠️  BGG sync worker disabled (BGG_ACCESS_TOKEN not set)");
    return { stop: () => {} };
  }

  const staleMs = parseDurationToMs(process.env.BGG_STALE_TIME, 86_400_000);
  const syncAll = String(process.env.BGG_SYNC_ALL).toLowerCase() === "true";

  // Keep this fairly slow; BGG throttles heavily.
  const tickMs = 15_000;

  const client = new BggXmlApi2Client({
    token,
    throttleMs: 5000,
    maxRetries: 5,
    retryDelayMs: 5000,
  });

  let timer: NodeJS.Timeout | undefined;
  let running = false;

  async function ensureSchema(): Promise<void> {
    // Idempotent: Adds thumbnail_url and bgg_fetched_at if not already present
    // Fancy word, I must use it
    await pool.query(`ALTER TABLE boardgames ADD COLUMN IF NOT EXISTS thumbnail_url TEXT`);
    await pool.query(`ALTER TABLE boardgames ADD COLUMN IF NOT EXISTS bgg_fetched_at TIMESTAMPTZ`);
  }

  async function syncOne(): Promise<void> {
    if (running) return;
    running = true;

    let currentBggId: number | null = null;

    try {
      const cutoff = new Date(Date.now() - staleMs);

      // If sync all is set, all games are refreshed,
      // if not, only those in user collections are refreshed.
      const candidate = await pool.query(
        syncAll
          ? `SELECT b.bgg_id
             FROM boardgames b
             WHERE (b.bgg_fetched_at IS NULL OR b.bgg_fetched_at < $1)
             ORDER BY b.bgg_fetched_at NULLS FIRST
             LIMIT 1`
          : `SELECT b.bgg_id
             FROM boardgames b
             WHERE (b.bgg_fetched_at IS NULL OR b.bgg_fetched_at < $1)
               AND (
                 EXISTS (SELECT 1 FROM userBoardgames ub WHERE ub.bgg_id = b.bgg_id)
                 OR EXISTS (SELECT 1 FROM sessions s WHERE s.game_id = b.game_id)
               )
             ORDER BY b.bgg_fetched_at NULLS FIRST
             LIMIT 1`,
        [cutoff]
      );

      if (candidate.rows.length === 0) {
        return;
      }

      const bggId = Number(candidate.rows[0].bgg_id);
      
      currentBggId = bggId;

      const thing = await client.getThing(bggId);

      await pool.query(
        `UPDATE boardgames
         SET
           name = COALESCE($2, name),
           year_published = COALESCE($3, year_published),
           rank = COALESCE($4, rank),
           bayes_average = COALESCE($5, bayes_average),
           average = COALESCE($6, average),
           users_rated = COALESCE($7, users_rated),
           is_expansion = COALESCE($8, is_expansion),
           thumbnail_url = COALESCE($9, thumbnail_url),
           bgg_fetched_at = NOW()
         WHERE bgg_id = $1`,
        [
          bggId,
          thing.name ?? null,
          thing.year_published ?? null,
          thing.rank ?? null,
          thing.bayes_average ?? null,
          thing.average ?? null,
          thing.users_rated ?? null,
          thing.is_expansion ?? null,
          thing.thumbnail_url ?? null,
        ]
      );

      console.log(`✅ Refreshed BGG data for bgg_id=${bggId}`);
    } catch (err) {
      console.error("❌ BGG sync worker failed", err);

      // Avoid hammering the same row on every tick if BGG is down.
      if (currentBggId !== null) {
        try {
          await pool.query(`UPDATE boardgames SET bgg_fetched_at = NOW() WHERE bgg_id = $1`, [currentBggId]);
        } catch {
          // ignore
        }
      }
    } finally {
      running = false;
    }
  }

  (async () => {
    try {
      await ensureSchema();
      console.log(
        `🔄 BGG sync worker started (stale>${Math.round(staleMs / 1000)}s, scope=${syncAll ? "all" : "referenced"})`
      );
      // Kick once immediately, then continue.
      await syncOne();
      timer = setInterval(() => void syncOne(), tickMs);
    } catch (err) {
      console.error("❌ Failed to start BGG sync worker", err);
    }
  })();

  return {
    stop: () => {
      if (timer) clearInterval(timer);
    },
  };
}
