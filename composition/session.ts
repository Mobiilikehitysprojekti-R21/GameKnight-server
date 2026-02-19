import { CreateSession } from "../application/session/CreateSession";
import { AddLocationToSession } from "../application/session/AddLocationToSession";
import PostgresLocationRepository from "../infrastructure/postgres/LocationRepository";
import getSessions from "../application/session/GetGameSessions";
import PostgresSessionRepository from "../infrastructure/postgres/SessionRepository";
import { pool } from "../infrastructure/postgres/db";
import UpdateSession from "../application/session/updateSession";
import GetSessionById from "../application/session/GetSessionById";
import GetSessionsByUserId from "../application/session/GetSessionsByUserId";

const createSessionUseCases = function () {
  const sessionRepo = new PostgresSessionRepository(pool);
  const locationRepository = new PostgresLocationRepository(pool);

  return {
    getSessions: new getSessions(sessionRepo),
    getSessionById: new GetSessionById(sessionRepo),
    getSessionsByUserId: new GetSessionsByUserId(sessionRepo),
    updateSession: new UpdateSession(sessionRepo),
    createSession: new CreateSession(sessionRepo, locationRepository),
    addLocationToSession: new AddLocationToSession(sessionRepo, locationRepository),
  };
};

export default createSessionUseCases;
