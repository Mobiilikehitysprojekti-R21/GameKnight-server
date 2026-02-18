import { Pool } from "pg";

export const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
      }
    : {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        // Support legacy env var names used in this repo.
        database:
          process.env.DATABASE_NAME ??
          process.env.PG_DATABASE ??
          process.env.PGDATABASE,
        port: process.env.DATABASE_PORT
          ? Number(process.env.DATABASE_PORT)
          : 5432,
      }
);
