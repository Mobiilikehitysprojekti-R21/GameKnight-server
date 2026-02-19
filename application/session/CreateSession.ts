import Location from "../../domain/Location";
import SessionRepository, { SessionDTO } from "../../ports/SessionRepository";
import { LocationRepository } from "../../ports/LocationRepository";

interface CreateSessionInput {
  user_id: number;
  group_id?: number | null;
  game_id: number;
  played_at: Date;
  location?: {
    name: string;
  };
  notes?: string;
  guest_players?: Array<{
    name: string;
  }>;
  players?: Array<{
    user_id?: number | null;
    guest_name?: string | null;
    score?: number | null;
    is_winner?: boolean | null;
  }>;
}

export class CreateSession {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly locationRepository: LocationRepository
  ) { }

  async execute(input: CreateSessionInput): Promise<SessionDTO> {
    let locationId: number | undefined;

    if (input.location) {
      const location = await this.locationRepository.create(
        new Location({ name: input.location.name, location_id: 0, latitude: 0, longitude: 0 })
      );
      locationId = location.location_id;
    }

    const result = await this.sessionRepository.createSessions({
      user_id: input.user_id,
      group_id: input.group_id,
      game_id: input.game_id,
      played_at: input.played_at,
      location_id: locationId,
      notes: input.notes,
      guest_players: input.guest_players,
      players: input.players
    });

    if (!result) {
      throw new Error("Failed to create session");
    }

    const created = await this.sessionRepository.getSessionById(result.session_id);
    if (!created) {
      throw new Error("Failed to load created session");
    }

    return created;
  }
}

export default CreateSession;