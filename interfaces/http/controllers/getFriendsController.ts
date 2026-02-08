import { Request, Response } from "express";
import GetFriends from "../../../application/friendships/GetFriends";


interface AuthenticatedRequest extends Request {
  user: { id: string };
}

export default (getFriends: GetFriends) =>
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = Number(req.user.id);
      if (!Number.isFinite(userId)) {
        res.status(401).json({ error: "Unauthorized: userId missing" });
        return;
      }

      const friends = await getFriends.execute({ userId });
      res.status(200).json(friends);
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ error: error.message });
    }
  };