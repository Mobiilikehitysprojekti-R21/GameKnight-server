import { Request, Response } from "express";
import createSessionUseCases from "../../../composition/session";

const { UpdateSession } = createSessionUseCases();

export const updateSessionController = async (req: Request, res: Response) => {
  try {
    const sessionData = req.body;
    await UpdateSession.execute(sessionData);
    res.status(200).json({ message: "Session updated successfully" });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};