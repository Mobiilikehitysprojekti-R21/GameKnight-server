export interface BggThingData {
  bgg_id: number;
  name?: string;
  year_published?: number;
  rank?: number;
  bayes_average?: number;
  average?: number;
  users_rated?: number;
  is_expansion?: boolean;
  thumbnail_url?: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Supported examples: 86400, 86400s, 1440m, 24h, 1d
export function parseDurationToMs(value: string | undefined, defaultMs: number): number {
  if (!value) return defaultMs;

  const trimmed = value.trim();
  if (!trimmed) return defaultMs;

  const match = trimmed.match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m|h|d)?$/i);
  if (!match) return defaultMs;

  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return defaultMs;

  const unit = (match[2] || "s").toLowerCase();
  switch (unit) {
    case "ms":
      return Math.round(amount);
    case "s":
      return Math.round(amount * 1000);
    case "m":
      return Math.round(amount * 60_000);
    case "h":
      return Math.round(amount * 3_600_000);
    case "d":
      return Math.round(amount * 86_400_000);
    default:
      return defaultMs;
  }
}

function decodeXmlEntities(s: string): string {
  // Minimal decoding for attributes we care about.
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function pickFirst<T>(...values: Array<T | undefined>): T | undefined {
  for (const v of values) {
    if (v !== undefined) return v;
  }
  return undefined;
}

export function parseXmlApi2Thing(xml: string, bggId: number): BggThingData {
  const data: BggThingData = { bgg_id: bggId };

  // <item type="boardgame" ...>
  const itemTypeMatch = xml.match(/<item\b[^>]*\btype="([^"]+)"/i);
  const itemType = itemTypeMatch ? itemTypeMatch[1] : undefined;
  if (itemType) {
    data.is_expansion = /expansion/i.test(itemType);
  }

  // <thumbnail>...</thumbnail>
  const thumbnailMatch = xml.match(/<thumbnail>([^<]+)<\/thumbnail>/i);
  if (thumbnailMatch) {
    data.thumbnail_url = thumbnailMatch[1].trim();
  }

  // <name type="primary" value="..."/>
  const primaryNameMatch = xml.match(/<name\b[^>]*\btype="primary"[^>]*\bvalue="([^"]+)"/i);
  if (primaryNameMatch) {
    data.name = decodeXmlEntities(primaryNameMatch[1]).trim();
  }

  // <yearpublished value="2010"/>
  const yearMatch = xml.match(/<yearpublished\b[^>]*\bvalue="([^"]+)"/i);
  if (yearMatch) {
    const year = Number(yearMatch[1]);
    if (Number.isFinite(year)) data.year_published = year;
  }

  // Ratings fields (usually in <statistics><ratings>...)
  const usersRatedMatch = xml.match(/<usersrated\b[^>]*\bvalue="([^"]+)"/i);
  if (usersRatedMatch) {
    const n = Number(usersRatedMatch[1]);
    if (Number.isFinite(n)) data.users_rated = n;
  }

  const averageMatch = xml.match(/<average\b[^>]*\bvalue="([^"]+)"/i);
  if (averageMatch) {
    const n = Number(averageMatch[1]);
    if (Number.isFinite(n)) data.average = n;
  }

  const bayesAverageMatch = xml.match(/<bayesaverage\b[^>]*\bvalue="([^"]+)"/i);
  if (bayesAverageMatch) {
    const n = Number(bayesAverageMatch[1]);
    if (Number.isFinite(n)) data.bayes_average = n;
  }

  // Rank (boardgame subtype). Value can be "Not Ranked".
  const rankMatch = xml.match(/<rank\b[^>]*\bname="boardgame"[^>]*\bvalue="([^"]+)"/i);
  if (rankMatch) {
    const raw = rankMatch[1];
    const n = Number(raw);
    if (Number.isFinite(n)) data.rank = n;
  }

  // If rank wasn't found via name="boardgame", try friendlyname="Board Game Rank".
  if (data.rank === undefined) {
    const altRankMatch = xml.match(/<rank\b[^>]*\bfriendlyname="Board Game Rank"[^>]*\bvalue="([^"]+)"/i);
    if (altRankMatch) {
      const raw = altRankMatch[1];
      const n = Number(raw);
      if (Number.isFinite(n)) data.rank = n;
    }
  }

  // Sometimes BGG sends "0"/"N/A"-like values; avoid overwriting DB with NaN.
  data.name = pickFirst(data.name, undefined);

  return data;
}

export class BggXmlApi2Client {
  private nextAllowedAtMs = 0;

  constructor(
    private readonly opts: {
      baseUrl?: string;
      token: string;
      throttleMs?: number;
      maxRetries?: number;
      retryDelayMs?: number;
    }
  ) {}

  private async throttle(): Promise<void> {
    const now = Date.now();
    const waitMs = this.nextAllowedAtMs - now;
    if (waitMs > 0) {
      await sleep(waitMs);
    }
    const throttleMs = this.opts.throttleMs ?? 5000;
    this.nextAllowedAtMs = Date.now() + throttleMs;
  }

  async getThing(id: number): Promise<BggThingData> {
    const baseUrl = this.opts.baseUrl ?? "https://boardgamegeek.com";
    const maxRetries = this.opts.maxRetries ?? 3;
    const retryDelayMs = this.opts.retryDelayMs ?? 5000;

    let lastErr: unknown;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      await this.throttle();

      const url = `${baseUrl}/xmlapi2/thing?id=${encodeURIComponent(String(id))}&stats=1`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.opts.token}`,
          Accept: "application/xml",
        },
      });

      // XMLAPI2 can return 202 when the result is queued.
      if (res.status === 202) {
        await sleep(retryDelayMs);
        continue;
      }

      if (!res.ok) {
        lastErr = new Error(`BGG XMLAPI2 /thing failed: HTTP ${res.status}`);
        await sleep(retryDelayMs);
        continue;
      }

      const xml = await res.text();
      return parseXmlApi2Thing(xml, id);
    }

    throw lastErr instanceof Error ? lastErr : new Error("BGG XMLAPI2 /thing failed");
  }
}
