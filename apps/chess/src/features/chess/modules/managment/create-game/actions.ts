"use server";

import { INITIAL_FEN_POSITION } from "chess-lite/fen";
import { redirect } from "next/navigation";
import crypto from "crypto";

import { createClient } from "@/services/supabase/server";
import {
  INITIAL_CHESS_STATE,
  GameType,
} from "@/features/chess/store/definitions";
import { Tables } from "@/services/supabase/tables";
import { RAW_GAME_SCHEMA } from "@/services/supabase/models";

import { UserService } from "@/services/supabase/api/server/user";
import { createUserHistory } from "@/features/chess/api/actions";
import { z } from "zod";

async function createChessGame(type: GameType) {
  let redirectId: string | null = null;
  try {
    const client = await createClient();
    const userData = await UserService.getUserData(client);


    const randomNumber = Math.random() < 0.5 ? 0 : 1;

    let data: Omit<
      z.infer<typeof RAW_GAME_SCHEMA>,
      "created_at" | "id" | "status"
    > = structuredClone({
      fen: INITIAL_FEN_POSITION,
      type: type,
      gameState: INITIAL_CHESS_STATE.gameState,
      users: INITIAL_CHESS_STATE.users,
      chat: INITIAL_CHESS_STATE.chat,
      movesHistory: "",
      winnerId: null,
      history: [INITIAL_FEN_POSITION],
    });

    data.users[randomNumber]!.id = userData.id as string;

    if (type === "engine") {
      data.users[!!randomNumber ? 0 : 1]!.id = "engine";
    }

    const { data: insertData, error: insertError } = await client
      .from(Tables.GAMES_DATA)
      .insert({ ...data })
      .select("id")
      .single();

    if (insertError) throw insertError;

    // TODO: refactor to background server function
    await createUserHistory(insertData.id, client);
    redirectId = insertData.id;
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    if (redirectId) {
      redirect(`/play/${redirectId}`);
    }
  }
}

export { createChessGame };
