import createHttpServer from "./interfaces/http/server";

import "dotenv/config";
import { pool } from "./infrastructure/postgres/db";
import PostgresUserRepository from "./infrastructure/postgres/UserRepository";

console.log("DATABASE_URL =", process.env.DATABASE_URL);

(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connection OK");
  } catch (err) {
    console.error("❌ Database connection failed", err);
  }
})();

const userUseCases = require("./composition/user")();
const boardGameUseCases = require("./composition/boardGame")();
const friendshipUseCases = require("./composition/friendships")();
const sessionUseCases = require("./composition/session")();
const sessionPlayerUseCases = require("./composition/sessionPlayer")(); 

const app = createHttpServer({
  ...userUseCases,
  ...boardGameUseCases,
  ...friendshipUseCases,
  ...sessionUseCases,
  ...sessionPlayerUseCases,
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
