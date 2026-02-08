import { Request, Response } from "express";
import AddFriend from "../../../application/friendships/AddFriend";


interface AuthenticatedRequest extends Request {
  user: { id: string };
}

export default (addFriend: AddFriend) =>
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { nickname } = req.body;

    if (!nickname) {
      res.status(400).json({ error: "nickname is required in body" });
      return;
    }

    try {
      // If userId is needed, extract from req.user (authentication middleware)
      // Otherwise, remove userId from execute input
      const user = req.user;
      if (!user || !user.id) {
        res.status(401).json({ error: "Unauthorized: user id missing" });
        return;
      }
      const userId = Number(user.id);
      if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user id" });
        return;
      }
      const requestId = await addFriend.execute({ userId, nickname });
      res.status(200).json({ requestId });
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ error: error.message });
    }
  };