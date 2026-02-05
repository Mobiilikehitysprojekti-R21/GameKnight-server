import { Request, Response } from "express";
import DeclineRequest from "../../../application/friendships/DeclineRequest";

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

export default (declineRequest: DeclineRequest) =>
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = Number(req.user.id);
      if (!Number.isFinite(userId)) {
        res.status(400).json({ error: "user_id query param is required" });
        return;
      }

      const friendRequests = await declineRequest.execute({ userId, requestId: Number(req.query.request_id) });
      res.status(200).json(friendRequests);
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ error: error.message });
    }
  };

