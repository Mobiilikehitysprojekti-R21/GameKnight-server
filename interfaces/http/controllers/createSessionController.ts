import { Request, Response } from "express";
import { CreateSession } from "../../../application/session/CreateSession";

export const createSessionController =
  (createSession: CreateSession) =>
  async (req: Request, res: Response) => {
    // Accept both snake_case and camelCase bodies.
    // I _think_ this was easier fix (but not pretty...)
    const group_id = req.body.group_id ?? req.body.groupId;
    const game_id = req.body.game_id ?? req.body.boardGameId ?? req.body.gameId;
    const played_at_raw = req.body.played_at ?? req.body.playedAt;

    const session = await createSession.execute({
      session_id: 0,
      group_id,
      game_id,
      played_at: played_at_raw ? new Date(played_at_raw) : new Date(),
      location: req.body.location,
      notes: req.body.notes,
    });

    res.status(201).json(session);
  };
