import { Request, Response } from "express";
import { CreateSession } from "../../../application/session/CreateSession";

export const createSessionController =
  (createSession: CreateSession) =>
  async (req: Request, res: Response) => {
    const { groupId, boardGameId, playedAt, location } = req.body;

    const session = await createSession.execute({
      groupId,
      boardGameId,
      playedAt: new Date(playedAt),
      location
    });

    res.status(201).json(session);
  };
