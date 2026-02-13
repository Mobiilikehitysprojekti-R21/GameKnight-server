import SessionRepository from "../../ports/SessionRepository";
import { LocationRepository } from "../../ports/LocationRepository";
import Location from "../../domain/Location";

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
    const sessions = await this.sessionRepository.getSessions();
    const session = sessions.find(s => s.session_id === sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    const location = await this.locationRepository.create(
      new Location({ name, location_id: 0, latitude: 0, longitude: 0 })
    );

    const updatedSession = { ...session, location_id: location.location_id };

    await this.sessionRepository.updateSession(updatedSession);
  }
}

export default AddLocationToSession;