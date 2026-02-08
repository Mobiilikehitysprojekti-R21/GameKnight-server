import SessionPlayer from "../domain/SessionPlayer";

abstract class SessionPlayerRepository {
  abstract saveSessionPlayer(sessionPlayer: SessionPlayer): Promise<void>;
  abstract findBySessionID(sessionID: number): Promise<SessionPlayer[]>;
  abstract findByUserID(userID: number): Promise<SessionPlayer[]>;
  abstract findBySessionAndUser(sessionID: number, userID: number): Promise<SessionPlayer | undefined>;
}

export default SessionPlayerRepository;
