import Session from "../../domain/Session";
import Location from "../../domain/Location";
import SessionRepository from "../../ports/SessionRepository";
import { LocationRepository } from "../../ports/LocationRepository";

interface CreateSessionInput {
  session_id: number;
  group_id?: number | null;
  user_id?: number | null;
  game_id: number;
  played_at: Date;
  location?: {
    name: string;
  };
  notes?: string;
}

export class CreateSession {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly locationRepository: LocationRepository
  ) { }

  async execute(input: CreateSessionInput): Promise<Session> {
    let locationId: number | undefined;

    if (input.location) {
      const location = await this.locationRepository.create(
        new Location({ name: input.location.name, location_id: 0, latitude: 0, longitude: 0 })
      );
      locationId = location.location_id;
    }

    const session = new Session({
      session_id: 0, // repo asettaa
      group_id: input.group_id,
      game_id: input.game_id,
      played_at: input.played_at,
      location_id: locationId,
      notes: input.notes
    });

    await this.sessionRepository.updateSession(session);

    return session;
  }
}

export default CreateSession;