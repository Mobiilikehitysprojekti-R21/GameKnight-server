import { Request, Response } from "express";
import getSessions from "../../../application/session/GetGameSessions";

export default (getSessionsUseCase: getSessions) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const sessions = await getSessionsUseCase.execute();
      res.status(200).json(sessions);
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ error: error.message });
    }
  };
