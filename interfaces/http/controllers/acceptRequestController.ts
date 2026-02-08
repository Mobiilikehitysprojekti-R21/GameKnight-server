import { Request, Response } from "express";
import AcceptRequest from "../../../application/friendships/AcceptRequest";

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

export default (acceptRequest: AcceptRequest) =>
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { request_id } = req.body;

    if (!request_id) {
      res.status(400).json({ error: "request_id is required in body" });
      return;
    }

    try {
      const userId = req.user.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized: userId missing" });
        return;
      }
      await acceptRequest.execute({ userId: Number(userId), requestId: Number(request_id) });
      res.status(200).json({ success: true });
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ error: error.message });
    }
  };