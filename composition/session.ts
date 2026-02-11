import { CreateSession } from "../application/session/CreateSession";
import { AddLocationToSession } from "../application/session/AddLocationToSession";

import SessionRepository from "../infrastructure/postgres/SessionRepository";
import LocationRepository from "../infrastructure/postgres/LocationRepository";

const sessionRepository = new SessionRepository();
const locationRepository = new LocationRepository();

export const sessionComposition = {
  createSession: new CreateSession(sessionRepository, locationRepository),
  addLocationToSession: new AddLocationToSession(
    sessionRepository,
    locationRepository
  )
};
