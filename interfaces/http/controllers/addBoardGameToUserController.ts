import { Request, Response } from "express";
import AddBoardGameToUser from "../../../application/boardgame/AddBoardGameToUser";

export default (addGameToUser: AddBoardGameToUser) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const newGame = await addGameToUser.execute(req.body)
      res.status(201).json(newGame);
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ error: error.message });
    }
  };