import { Request, Response } from "express";
import getSessions from "../../../application/session/GetGameSessions";
import GetSessionsByUserId from "../../../application/session/GetSessionsByUserId";
import UserRepository from "../../../ports/UserRepository";

export default (getSessionsUseCase: getSessions, getSessionsByUserIdUseCase?: GetSessionsByUserId, userRepository?: UserRepository) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      // If user is authenticated, get their sessions
      const auth0_id = (req as any).auth?.sub;
      
      if (auth0_id && getSessionsByUserIdUseCase && userRepository) {
        try {
          const user = await userRepository.findById(auth0_id);
          if (user && user.user_id) {
            const sessions = await getSessionsByUserIdUseCase.execute({ userId: user.user_id });
            res.status(200).json(sessions);
            return;
          }
        } catch (e) {
          console.error("Error fetching user sessions:", e);
          // Don't fall back to all sessions - authenticated users should only see their own
          res.status(400).json({ error: "Failed to fetch your sessions" });
          return;
        }
      }
      
      // Return all sessions for stats on homepage (if not authenticated) 
      const sessions = await getSessionsUseCase.execute();
      res.status(200).json(sessions);
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ error: error.message });
    }
  };
