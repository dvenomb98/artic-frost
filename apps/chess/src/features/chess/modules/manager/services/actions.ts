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
import { revalidateAllPaths } from "@/lib/cache";
import { EngineDifficultyKeys } from "@/services/models";
import { ROUTES } from "@/lib/routes";

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

  if (existingGameId) redirect(`${ROUTES.MAIN.PLAY}/${existingGameId}`);

  let createdGameId: number | null = null;
  // Create new game if none found
  try {
    createdGameId = await createChessGame({
      type: "vs",
      session_type: "PUBLIC",
      engine_difficulty: null,
    });
  } catch (e) {
    return handleFormErrors(e);
  }

  revalidateAllPaths();

  if (createdGameId) {
    redirect(`${ROUTES.MAIN.PLAY}/${createdGameId}`);
  }

  return handleFormErrors(new Error("Unknown error occured. Try again later."));
}

async function createPrivateChessGame(
  type: z.infer<typeof GAME_TYPE_SCHEMA>,
  difficulty: EngineDifficultyKeys | null
) {
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
      engine_difficulty: difficulty,
    });
  } catch (e) {
    return handleFormErrors(e);
  }

  revalidateAllPaths();
  if (gameId) redirect(`${ROUTES.MAIN.PLAY}/${gameId}`);

  return handleFormErrors(new Error("Unknown error occured. Try again later."));
}

async function surrender(data: z.infer<typeof SURRENDER_SCHEMA>) {
  try {
    if (data.status === "FINISHED")
      return handleFormErrors(new Error("Game already ended!"));
    if (data.status === "IN_QUEUE")
      return handleFormErrors(new Error("Wait for other player to join!"));

    const userData = await UserService.getUserData();

    await updateSurrenderGameData(data, userData);
  } catch (e) {
    return handleFormErrors(e);
  }
}

export { playMatchmakingGame, createPrivateChessGame, surrender };
