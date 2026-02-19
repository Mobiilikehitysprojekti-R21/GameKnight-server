import { Request, Response } from "express";
import AddFavoriteLocation from "../../../application/user/AddFavoriteLocation";

export default (addFavoriteLocation: AddFavoriteLocation) =>
  async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.params.userId);

    if (!Number.isFinite(userId)) {
      res.status(400).json({ error: "Invalid userId" });
      return;
    }

    const { name, latitude, longitude } = req.body as {
      name?: string;
      latitude?: number;
      longitude?: number;
    };

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      res.status(400).json({ error: "latitude and longitude are required" });
      return;
    }

    try {
      const location = await addFavoriteLocation.execute({
        userId,
        name,
        latitude: Number(latitude),
        longitude: Number(longitude),
      });
      res.status(201).json(location);
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ error: error.message });
    }
  };
