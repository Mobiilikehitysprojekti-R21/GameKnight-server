import { Request, Response } from "express";
import GetSessionsByUserId from "../../../application/session/GetSessionsByUserId";

export default (getSessionsByUserId: GetSessionsByUserId) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Number(req.params.user_id);
      if (!Number.isFinite(userId)) {
        res.status(400).json({ error: "Invalid user id" });
        return;
      }

      const sessions = await getSessionsByUserId.execute({ userId });
      res.status(200).json(sessions);
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ error: error.message });
    }
  };
