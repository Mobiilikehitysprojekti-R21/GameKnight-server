import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import AddAvatar from "../../../application/user/AddAvatar";

export default (addAvatar: AddAvatar) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Get auth0_id from middleware
      const auth0Id = (req as any).auth?.sub;
      if (!auth0Id) {
        // Reject request if authentication fails
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // Expected image in base64-form
      // Works with browser and mobile
      const { image } = req.body;
      if (!image || typeof image !== "string") {
        res.status(400).json({ error: "Missing or invalid image data" });
        return;
      }

      // Erase data URL -prefix (if exists) and decode base64 to binary.
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Image is saved with ".jpg"
      // Auth0_id is parsed for filename (filename do not allow '|')
      // Timestamp is added to filename (unique name helps with UI re-render)
      const ext = ".jpg";
      const safeUserId = String(auth0Id).replace(/[<>:"/\\|?*]/g, "_");
      const filename = `avatar_${safeUserId}_${Date.now()}${ext}`;

      // Ensure the folders are found. If not --> create folders
      const uploadDir = path.join("uploads", "avatars");
      fs.mkdirSync(uploadDir, { recursive: true });

      // Filepath
      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, buffer);

      // Finally form the the public URL
      // and update the new profile picture to user
      const avatarUrl = `/uploads/avatars/${filename}`;
      const newAvatar = await addAvatar.execute({
        auth0_id: auth0Id,
        avatar_url: avatarUrl,
      });

      // Return created URL
      res.status(201).json({ avatar_url: newAvatar });
    } catch (e) {
      const error = e as Error;
      console.error("Avatar upload error:", error);
      res.status(400).json({ error: error.message });
    }
  };