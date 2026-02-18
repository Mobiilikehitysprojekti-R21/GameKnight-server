import { Request, Response } from "express";
import FetchUserNickname from "../../../application/user/FetchUserNickname";

// Despite the name, all user data is fetched

export default (fetchUserNickname: FetchUserNickname) =>
    async (req: Request, res: Response): Promise<void> => {
        try {
            const nick = await fetchUserNickname.execute(req.body)
            res.status(201).json(nick)
        } catch (e) {
                const error = e as Error;
                res.status(400).json({ error: error.message });

        }
    }