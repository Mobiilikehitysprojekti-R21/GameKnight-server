import saveSessionPlayer from "../application/sessionPlayer/saveSessionPlayer";
import findBySessionAndUser from "../application/sessionPlayer/findBySessionAndUser";
import findBySessionID from "../application/sessionPlayer/findBySessionID";
import findByUserID from "../application/sessionPlayer/findByUserID";
import PostgresSessionPlayerRepository from "../infrastructure/postgres/SessionPlayerRepository";
import { pool } from "../infrastructure/postgres/db";

module.exports = function createSessionUseCases() {
   const sessionPlayerRepo = new PostgresSessionPlayerRepository(pool);

  return {
    saveSessionPlayer: new saveSessionPlayer(sessionPlayerRepo),
    findBySessionID: new findBySessionID(sessionPlayerRepo),
    findByUserID: new findByUserID(sessionPlayerRepo),
    findBySessionAndUser: new findBySessionAndUser(sessionPlayerRepo),
  };
};