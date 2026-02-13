import { Request, Response } from "express";
import addSession from "../../../application/session/addSession";

export default (addSessionUseCase: addSession) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const sessionData = req.body;
      await addSessionUseCase.execute(sessionData);
      res.status(201).json({ message: "Session created successfully" });
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ error: error.message });
    }
  };