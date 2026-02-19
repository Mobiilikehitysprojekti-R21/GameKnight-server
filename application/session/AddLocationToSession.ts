import SessionRepository from "../../ports/SessionRepository";
import { LocationRepository } from "../../ports/LocationRepository";
import Location from "../../domain/Location";
import Session from "../../domain/Session";

interface Input {
  sessionId: number;
  name: string;
}

export class AddLocationToSession {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly locationRepository: LocationRepository
  ) {}

  async execute({ sessionId, name}: Input): Promise<void> {
    const session = await this.sessionRepository.getSessionById(sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    const location = await this.locationRepository.create(
      new Location({ name, location_id: 0, latitude: 0, longitude: 0 })
    );

    await this.sessionRepository.updateSession(
      new Session({
        session_id: session.session_id,
        group_id: session.group_id,
        game_id: session.game_id,
        played_at: session.played_at,
        location_id: location.location_id,
        notes: session.notes ?? undefined,
      })
    );
  }
}

export default AddLocationToSession;