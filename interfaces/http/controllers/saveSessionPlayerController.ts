import { Request, Response } from "express";
import saveSessionPlayer from "../../../application/sessionPlayer/saveSessionPlayer";

export default (saveSessionPlayerUseCase: saveSessionPlayer) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const playerData = req.body;
      await saveSessionPlayerUseCase.execute(playerData);
      res.status(201).json({ message: "Session player saved successfully" });
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ error: error.message });
    }
  };