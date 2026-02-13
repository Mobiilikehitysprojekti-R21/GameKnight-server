import { CreateSession } from "../application/session/CreateSession";
import { AddLocationToSession } from "../application/session/AddLocationToSession";

import SessionRepository from "../infrastructure/postgres/SessionRepository";
import LocationRepository from "../infrastructure/postgres/LocationRepository";
import { pool } from "../infrastructure/postgres/db";


const sessionRepository = new SessionRepository(pool);
const locationRepository = new LocationRepository(pool);


export const sessionComposition = {
  createSession: new CreateSession(sessionRepository, locationRepository),
  addLocationToSession: new AddLocationToSession(
    sessionRepository,
    locationRepository
  )
};
