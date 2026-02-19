import { Request, Response } from "express";
import GetSessionById from "../../../application/session/GetSessionById";

export default (getSessionById: GetSessionById) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const sessionId = Number(req.params.id);
      if (!Number.isFinite(sessionId)) {
        res.status(400).json({ error: "Invalid session id" });
        return;
      }

      const session = await getSessionById.execute({ sessionId });

      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }

      res.status(200).json(session);
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ error: error.message });
    }
  };
