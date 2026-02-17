import { Request, Response } from "express";
import AddAvatar from "../../../application/user/AddAvatar";

export default (addAvatar: AddAvatar) =>
  async (req: Request, res: Response): Promise<void> => {
    console.log("file", req.file, "body:", req.body)
    try {
      const auth0Id = (req as any).auth?.sub;
      if (!auth0Id) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      if (!req.file) {
        res.status(400).json({ error: "Missing file" });
        return;
      }

      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      const newAvatar = await addAvatar.execute({
        auth0_id: auth0Id,
        avatar_url: avatarUrl,
      });

      res.status(201).json({ avatar_url: newAvatar });
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ error: error.message });
    }
  };