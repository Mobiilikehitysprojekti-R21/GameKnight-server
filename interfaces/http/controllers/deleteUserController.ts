import { Request, Response } from "express";
import DeleteUser, { DeleteUserInput } from "../../../application/user/DeleteUser";

export default (deleteUser: DeleteUser) =>
    async (req: Request, res: Response): Promise<void> => {
        try{
            const raw = req.params.auth0_id
            const auth0_id = Array.isArray(raw) ? raw [0] : raw

            if (!auth0_id){
                res.status(400).json({ error: "Missing auth0_id parameter" });
                return
            }

            const input: DeleteUserInput = { auth0_id }

            await deleteUser.execute(input)
            res.status(200).json({ message: "User deleted"})
        } catch (e) {
            const error = e as Error
            res.status(400).json({ error: error.message })
        }
    }