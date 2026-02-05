import { Request, Response } from "express";
import InviteFriend from "../../../application/friendships/InviteFriend";

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

export default (inviteFriend: InviteFriend) =>
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "email is required" });
      return;
    }

    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized: userId missing" });
        return;
      }
      const result = await inviteFriend.execute({ userId: Number(userId), email });
      res.status(200).json(result);
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ error: error.message });
    }
  };