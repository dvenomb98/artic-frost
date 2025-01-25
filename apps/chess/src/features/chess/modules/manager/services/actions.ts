"use server";

import { redirect } from "next/navigation";
import {
  joinExistingGame,
  createChessGame,
  cancelLastGame,
  updateSurrenderGameData,
} from "./utils";

import { handleFormErrors } from "@/lib/forms";
import { GAME_TYPE_SCHEMA } from "@/services/supabase/models";
import { z } from "zod";
import { SURRENDER_SCHEMA } from "../models";
import { UserService } from "@/services/supabase/api/server/user";

async function playMatchmakingGame() {
  try {
    await cancelLastGame();
  } catch (e) {
    return handleFormErrors(e);
  }

  let existingGameId: number | null = null;

  // Try to join existing game
  try {
    existingGameId = await joinExistingGame();
  } catch (e) {
    return handleFormErrors(e);
  }

  if (existingGameId) redirect(`/play/${existingGameId}`);

  let createdGameId: number | null = null;
  // Create new game if none found
  try {
    createdGameId = await createChessGame({
      type: "vs",
      session_type: "PUBLIC",
    });
  } catch (e) {
    return handleFormErrors(e);
  }

  if (createdGameId) redirect(`/play/${createdGameId}`);

  return handleFormErrors(new Error("Unknown error occured. Try again later."));
}

async function createPrivateChessGame(type: z.infer<typeof GAME_TYPE_SCHEMA>) {
  try {
    await cancelLastGame();
  } catch (e) {
    return handleFormErrors(e);
  }

  let gameId: number | null = null;
  try {
    gameId = await createChessGame({
      type,
      session_type: "PRIVATE",
    });
  } catch (e) {
    return handleFormErrors(e);
  }

  if (gameId) redirect(`/play/${gameId}`);

  return handleFormErrors(new Error("Unknown error occured. Try again later."));
}

async function surrender(data: z.infer<typeof SURRENDER_SCHEMA>) {
  try {
    if (data.status === "FINISHED") return handleFormErrors(new Error("Game already ended!"));
    if (data.status === "IN_QUEUE")
      return handleFormErrors(new Error("Wait for other player to join!"));

    const userData = await UserService.getUserData();

    await updateSurrenderGameData(data, userData);
  } catch (e) {
    return handleFormErrors(e);
  }
}

export { playMatchmakingGame, createPrivateChessGame, surrender };
