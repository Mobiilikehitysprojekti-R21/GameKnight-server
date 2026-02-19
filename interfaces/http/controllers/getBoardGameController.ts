import { Request, Response } from "express";
import GetBoardGame from "../../../application/boardgame/GetBoardGame";

export default (getBoardGame: GetBoardGame) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const gameId = Number(req.params.id);

      if (!gameId || isNaN(gameId)) {
        res.status(400).json({ error: "Invalid game_id" });
        return;
      }

      const game = await getBoardGame.execute(gameId);

      if (!game) {
        res.status(404).json({ error: "Board game not found" });
        return;
      }

      res.status(200).json(game);
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ error: error.message });
    }
  };
