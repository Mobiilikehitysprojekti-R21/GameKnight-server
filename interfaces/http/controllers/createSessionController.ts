import { Request, Response } from "express";
import { CreateSession } from "../../../application/session/CreateSession";
import UserRepository from "../../../ports/UserRepository";

export const createSessionController = (createSession: CreateSession, userRepository: UserRepository) =>
  async (req: Request, res: Response) => {
    try {
      // Accept both snake_case and camelCase bodies.
      const group_id = req.body.group_id ?? req.body.groupId;
      const game_id = req.body.game_id ?? req.body.boardGameId ?? req.body.gameId;
      const played_at_raw = req.body.played_at ?? req.body.playedAt;
      const guest_players = req.body.guest_players ?? req.body.guestPlayers;
      const rawPlayers = req.body.players ?? req.body.session_players ?? req.body.sessionPlayers;
      const players = Array.isArray(rawPlayers)
        ? rawPlayers.map((p: any) => ({
          user_id: p.user_id ?? p.userId ?? null,
          guest_name: p.guest_name ?? p.guestName ?? null,
          score: p.score ?? null,
          is_winner: p.is_winner ?? p.isWinner ?? null,
        }))
        : undefined;

      // Validate required fields
      if (!game_id) {
        res.status(400).json({ error: "game_id is required" });
        return;
      }

      // Extract user ID from the verified JWT token
      const auth0_id = (req as any).auth?.sub;
      if (!auth0_id) {
        res.status(401).json({ error: "Unauthorized: userId missing" });
        return;
      }

      // Look up the user by auth0_id to get their numeric user_id
      let user;
      try {
        user = await userRepository.findById(auth0_id);
      } catch (dbError) {
        console.error("❌ Database error looking up user:", dbError);
        res.status(500).json({ error: "Database error: could not find user" });
        return;
      }

      if (!user || !user.user_id) {
        console.warn(`⚠️ User not found for auth0_id: ${auth0_id}`);
        res.status(401).json({ error: "Unauthorized: user not found in database. Please create your account first." });
        return;
      }

      const session = await createSession.execute({
        group_id,
        game_id,
        played_at: played_at_raw ? new Date(played_at_raw) : new Date(),
        location: req.body.location,
        notes: req.body.notes,
        guest_players,
        players,
        user_id: user.user_id
      });

      res.status(201).json(session);
    } catch (e) {
      const error = e as Error;
      console.error("❌ Error creating session:", error);
      res.status(500).json({ error: error.message });
    }
  };
