import { Request, Response } from "express";
import UpdateSession from "../../../application/session/updateSession";

export const updateSessionController =
  (updateSession: UpdateSession) =>
  async (req: Request, res: Response) => {
    try {
      const sessionData = req.body;
      await updateSession.execute(sessionData);
      res.status(200).json({ message: "Session updated successfully" });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };