"use server";

import { INITIAL_FEN_POSITION } from "chess-lite/fen";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { z } from "zod";

import { createClient } from "@/services/supabase/server";
import {
  INITIAL_CHESS_STATE,
  ChessUser,
  GameState,
  GameType,
} from "@/features/chess/store/definitions";
import { Tables } from "@/services/supabase/tables";
import { RawGameData } from "@/services/supabase/definitions";

import { createUserHistory } from "./requests/create-user-history";

async function createChessGame(type: GameType) {
  try {
    const client = createClient();

    const { data: userData, error } = await client.auth.getUser();
    if (error) throw error;

    const typedArray = new Uint8Array(5);
    const randomValues = crypto.getRandomValues(typedArray);
    const id = randomValues.join("");

    const randomNumber = Math.random() < 0.5 ? 0 : 1;

    let data: Omit<RawGameData, "created_at"> = structuredClone({
      fen: INITIAL_FEN_POSITION,
      type: type,
      gameState: INITIAL_CHESS_STATE.gameState,
      users: INITIAL_CHESS_STATE.users,
      chat: INITIAL_CHESS_STATE.chat,
      movesHistory: "",
      winnerId: null,
      id,
      history: [INITIAL_FEN_POSITION],
    });

    data.users[randomNumber]!.id = userData.user.id as string;

    if (type === "engine") {
      data.users[!!randomNumber ? 0 : 1]!.id = "engine";
    }

    const { error: insertError } = await client
      .from(Tables.GAMES_DATA)
      .insert({ ...data });
    if (insertError) throw insertError;

    // TODO: refactor to background server function
    await createUserHistory(id, client);
    redirect(`/play/${id}`);
  } catch (e) {
    throw e;
  }
}

async function findGame() {
  try {
    const client = createClient();
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError) throw userError;

    const { data: gamesData, error: gamesError } = await client
      .rpc("find_game", { user_id: userData.user.id })
      .returns<Array<{ id: string }>>();

    if (gamesError) throw gamesError;

    // Games not found
    if (!gamesData[0]?.id) {
      return {
        message:
          "Sorry, it seems like there are not games to join. Try to create your own.",
      };
    }

    redirect(`/play/${gamesData[0].id}`);
  } catch (e) {
    throw e;
  }
}

async function submitComment(gameId: string, formData: FormData) {
  try {
    const schema = z.object({
      text: z.string(),
      gameId: z.number(),
    });

    const fields = schema.safeParse({
      text: formData.get("text"),
      gameId,
    });

    if (!fields.success) throw fields.error;

    const { text, gameId: id } = fields.data;
    const client = createClient();

    // Validate user
    const { data: userData, error } = await client.auth.getUser();
    if (error) throw error;

    // Get current chat directly from db
    const { data, error: getError } = await client
      .from(Tables.GAMES_DATA)
      .select("chat")
      .eq("id", id)
      .limit(1)
      .single();

    if (getError) throw getError;

    const timestamp = Math.floor(Date.now() / 1000);

    let mutatedChat = data.chat || [];
    const dataToSend = {
      text,
      userId: userData.user.id,
      timestamp,
    };

    mutatedChat.push(dataToSend);

    // Update old chat
    const { error: updateError } = await client
      .from(Tables.GAMES_DATA)
      .update({ chat: mutatedChat })
      .eq("id", id);
    if (updateError) throw updateError;
  } catch (e) {
    throw e;
  }
}

async function surrender(gameId: string) {
  try {
    const schema = z.object({
      gameId: z.number(),
    });
    const fields = schema.parse({
      gameId,
    });

    const client = createClient();
    // Validate user
    const { data: userData, error: authError } = await client.auth.getUser();

    if (authError) throw authError;

    const { data, error: getError } = await client
      .from(Tables.GAMES_DATA)
      .select("users, gameState")
      .eq("id", fields.gameId)
      .single<{ users: ChessUser[]; gameState: GameState }>();

    if (getError) throw getError;

    if (!!data.gameState) throw new Error("Game already ended!");

    const winner = data.users.find(u => u.id !== userData.user.id && !!u.id);

    if (!winner) {
      throw new Error("Winner not found! Wait for other player to join.");
    }

    const { error: updateError } = await client
      .from(Tables.GAMES_DATA)
      .update({ winnerId: winner.id, gameState: "SURRENDER" })
      .eq("id", gameId);

    if (updateError) throw updateError;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export { createChessGame, submitComment, surrender, findGame };
