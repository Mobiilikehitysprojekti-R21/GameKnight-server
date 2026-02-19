import { Request, Response } from "express";
import GetFavoriteLocations from "../../../application/user/GetFavoriteLocations";

export default (getFavoriteLocations: GetFavoriteLocations) =>
  async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.params.userId);

    if (!Number.isFinite(userId)) {
      res.status(400).json({ error: "Invalid userId" });
      return;
    }

    try {
      const locations = await getFavoriteLocations.execute({ userId });
      res.status(200).json(locations);
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ error: error.message });
    }
  };
