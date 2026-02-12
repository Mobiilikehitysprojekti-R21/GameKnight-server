import Session from "../../domain/Session";
import Location from "../../domain/Location";
import SessionRepository from "../../ports/SessionRepository";
import { LocationRepository } from "../../ports/LocationRepository";

interface CreateSessionInput {
  groupId: number;
  boardGameId: number;
  playedAt: Date;
  location?: {
    name: string;
  };
  notes?: string;
}

export class CreateSession {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly locationRepository: LocationRepository
  ) {}

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
      group_id: input.groupId,
      game_id: input.boardGameId,
      played_at: input.playedAt,
      location_id: locationId,
      notes: input.notes
    });

    await this.sessionRepository.save(session);

    return session;
  }
}
