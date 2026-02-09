import SessionPlayerRepository from "../../ports/SessionPlayerRepository";
import SessionPlayer from "../../domain/SessionPlayer";

class InMemorySessionPlayerRepository extends SessionPlayerRepository {
  private readonly sessionPlayers: SessionPlayer[] = [];

  async saveSessionPlayer(sessionPlayer: SessionPlayer): Promise<void> {
    this.sessionPlayers.push(sessionPlayer);
  }

  async findBySessionID(sessionID: number): Promise<SessionPlayer[]> {
    return this.sessionPlayers.filter(sp => sp.session_id === sessionID);
  }

  async findByUserID(userID: number): Promise<SessionPlayer[]> {
    return this.sessionPlayers.filter(sp => sp.user_id === userID);
  }

  async findBySessionAndUser(sessionID: number, userID: number): Promise<SessionPlayer | undefined> {
    return this.sessionPlayers.find(sp => sp.session_id === sessionID && sp.user_id === userID);
  }
}

export default InMemorySessionPlayerRepository;
