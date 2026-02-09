import getSessions from "../application/session/getSessions";
import findByGroupID from "../application/session/findByGroupID";
import addSession from "../application/session/addSession";
// import InMemorySessionRepository from "../infrastructure/InMemory/SessionRepository";
import PostgresSessionRepository from "../infrastructure/postgres/SessionRepository";
import { pool } from "../infrastructure/postgres/db";

module.exports = function createSessionUseCases() {
 //  const sessionRepo = new InMemorySessionRepository();
   const sessionRepo = new PostgresSessionRepository(pool);

  return {
    addSession: new addSession(sessionRepo),
    findByGroupID: new findByGroupID(sessionRepo),
    getSessions: new getSessions(sessionRepo),
  };
};