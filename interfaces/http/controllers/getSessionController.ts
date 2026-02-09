import { Request, Response } from "express";
import getSessions from "../../../application/session/getSessions";

export default (getSessionsUseCase: getSessions) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      // ei filttereitä nyt, vaan kaikki sessiot, mutta voisi ottaa 
      // vaikkapa session_id, game_id, played_at, location_id
      const sessions = await getSessionsUseCase.execute;
      res.status(200).json(sessions);
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ error: error.message });
    }
  };