import { Request, Response } from "express";
import CreateUser from "../../../application/user/CreateUser";

export default (createUser: CreateUser) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract auth0_id from the verified JWT token
      const auth0_id = (req as any).auth?.sub;
      
      if (!auth0_id) {
        res.status(401).json({ error: "Unauthorized: missing user identity" });
        return;
      }

      const user = await createUser.execute({
        ...req.body,
        auth0_id,
      });
      res.status(201).json(user);
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ error: error.message });
    }
  };
