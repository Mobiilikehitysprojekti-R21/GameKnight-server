import { CreateSession } from "../application/session/CreateSession";
import { AddLocationToSession } from "../application/session/AddLocationToSession";
import PostgresLocationRepository from "../infrastructure/postgres/LocationRepository";
import getSessions from "../application/session/GetGameSessions";
import findByGroupID from "../application/session/findByGroupID";
import InMemorySessionRepository from "../infrastructure/InMemory/SessionRepository";
import PostgresSessionRepository from "../infrastructure/postgres/SessionRepository";
import { pool } from "../infrastructure/postgres/db";
import UpdateSession from "../application/session/updateSession";

const sessionRepository = new InMemorySessionRepository();
const locationRepository = new PostgresLocationRepository(pool);

export const sessionComposition = {
  createSession: new CreateSession(sessionRepository, locationRepository),
  addLocationToSession: new AddLocationToSession(
    sessionRepository,
    locationRepository
  )
};

const createSessionUseCases = function () {
   const sessionRepo = new PostgresSessionRepository(pool);

  return {
    findByGroupID: new findByGroupID(sessionRepo),
    getSessions: new getSessions(sessionRepo),
    UpdateSession: new UpdateSession(sessionRepo),
    CreateSession: new CreateSession(sessionRepo, locationRepository),
    AddLocationToSession: new AddLocationToSession(sessionRepo, locationRepository),
  };
}; 

export default createSessionUseCases;