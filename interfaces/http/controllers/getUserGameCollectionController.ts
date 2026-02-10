import { Request, Response } from "express";
import GetUserGameCollection from "../../../application/boardgame/GetUserGameCollection";

export default (getUserGameCollection: GetUserGameCollection) => 
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Number(req.params.user_id)
      console.log(userId)
      const boardgames = await getUserGameCollection.execute({userId});
      res.status(200).json(boardgames);
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ error: error.message });
    }
  };
