import { Request, Response } from "express";
import ChangeNickname, { ChangeNicknameInput } from "../../../application/user/ChangeNickname";

export default (updateNickname: ChangeNickname) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('UpdateNickname BODY: ', req.body)
      console.log('HEADERS:', req.headers['content-type'])
      
      const input: ChangeNicknameInput = {
        nickname: req.body.nickname,
        auth0_id: req.body.auth0_id
      }

      const user = await updateNickname.execute(input);

      res.status(201).json(user);
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ error: error.message });
    }
  };