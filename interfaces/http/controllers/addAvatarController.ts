import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import AddAvatar from "../../../application/user/AddAvatar";

export default (addAvatar: AddAvatar) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const auth0Id = (req as any).auth?.sub;
      if (!auth0Id) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { image } = req.body;
      if (!image || typeof image !== "string") {
        res.status(400).json({ error: "Missing or invalid image data" });
        return;
      }

      // Poista data:image/...;base64, prefix jos on
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const ext = ".jpg";
      const safeUserId = String(auth0Id).replace(/[<>:"/\\|?*]/g, "_");
      const filename = `avatar_${safeUserId}_${Date.now()}${ext}`; // Lisää timestamp
      
      const uploadDir = path.join("uploads", "avatars");
      fs.mkdirSync(uploadDir, { recursive: true });
      
      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, buffer);

      const avatarUrl = `/uploads/avatars/${filename}`;
      const newAvatar = await addAvatar.execute({
        auth0_id: auth0Id,
        avatar_url: avatarUrl,
      });

      res.status(201).json({ avatar_url: newAvatar });
    } catch (e) {
      const error = e as Error;
      console.error("Avatar upload error:", error);
      res.status(400).json({ error: error.message });
    }
  };