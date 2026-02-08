import { Request, Response } from "express";
import GetFriendRequests from "../../../application/friendships/GetFriendRequests";

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

export default (getFriendRequests: GetFriendRequests) =>
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const input = { userId: Number(req.user.id) }; 
      const friendRequests = await getFriendRequests.execute(input);
      res.status(200).json(friendRequests);
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ error: error.message });
    }
  };