import { Request, Response } from "express";
import ChangeNickname from "../../../application/user/ChangeNickname";

export default (updateNickname: ChangeNickname) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await updateNickname.execute(req.body);
      res.status(201).json(user);
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ error: error.message });
    }
  };