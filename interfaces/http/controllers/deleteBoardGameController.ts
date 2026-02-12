import { Request, Response } from "express";
import DeleteBoardGame, { DeleteBoardGameInput } from "../../../application/boardgame/DeleteBoardGame";

export default (deleteBoardGame: DeleteBoardGame) =>
    async (req: Request, res: Response): Promise<void> => {
        try {
            const raw = req.params.bgg_id
            const bgg_id = parseInt(Array.isArray(raw) ? raw[0] : raw, 10)

            if (!bgg_id) {
                res.status(400).json({ error: "Missing bgg_id parameter" });
                return
            }

            const input: DeleteBoardGameInput = { bgg_id }

            await deleteBoardGame.execute(input)
            res.status(200).json({ message: "Game deleted from collection" })
        } catch (e) {
            const error = e as Error
            res.status(400).json({ error: error.message })
        }
    }