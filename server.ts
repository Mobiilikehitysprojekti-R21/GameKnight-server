import "dotenv/config";
import createHttpServer from "./interfaces/http/server";
import { pool } from "./infrastructure/postgres/db";


// console.log("DATABASE_URL =", process.env.DATABASE_URL);

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
const sessionUseCases = require("./composition/session").default();
const sessionPlayerUseCases = require("./composition/sessionPlayer")(); 
const locationUseCases = require("./composition/location").default();

const app = createHttpServer({
  ...userUseCases,
  ...boardGameUseCases,
  ...friendshipUseCases,
  ...sessionUseCases,
  ...sessionPlayerUseCases,
  ...locationUseCases
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
