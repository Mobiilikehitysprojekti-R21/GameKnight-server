import { Request, Response } from "express";
import { AddLocationToSession } from "../../../application/session/AddLocationToSession";

export const addLocationToSessionController =
  (addLocationToSession: AddLocationToSession) =>
    async (req: Request, res: Response) => {
      const { sessionId, name } = req.body;

      await addLocationToSession.execute({
        sessionId,
        name
      });

      res.sendStatus(204);
    };
