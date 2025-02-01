import "server-only";

import { RAW_GAME_SCHEMA } from "@/services/supabase/models";
import { UserService } from "@/services/supabase/api/server/user";
import { createClient } from "@/services/supabase/server";
import { z } from "zod";
import { Tables } from "@/services/supabase/tables";

import { User } from "@supabase/supabase-js";
import { MATCH_MAKING_SCHEMA, SURRENDER_SCHEMA } from "../models";
import { CONFIG_SCHEMA } from "../models";
import { INITIAL_MATCHMAKING_STATE } from "../const";
import { SupabaseSafeUser } from "@/services/supabase/api/server/safe-session";

async function joinExistingGame(): Promise<number | null> {
  const client = await createClient();
  const userData = await UserService.getUserData(client);

  const foundedGame = await findGame();
  if (!foundedGame) return null;

  const updatedData = await updateJoinGameData(foundedGame, userData);
  return updatedData.id;
}

async function findGame() {
  const client = await createClient();
  const userData = await UserService.getUserData(client);

  const { data, error } = await client
    .from(Tables.GAMES_DATA)
    .select("*")
    .eq("status", "IN_QUEUE")
    .eq("session_type", "PUBLIC")
    .or(`user_white_id.is.null,user_white_id.neq.${userData.id}`)
    .or(`user_black_id.is.null,user_black_id.neq.${userData.id}`)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const parsedData = RAW_GAME_SCHEMA.parse(data);

  return parsedData;
}

async function updateJoinGameData(
  data: z.infer<typeof RAW_GAME_SCHEMA>,
  userData: SupabaseSafeUser
) {
  const client = await createClient();
  const targetUserKey =
    data.user_white_id === null ? "user_white_id" : "user_black_id";

  const updatedData = {
    [targetUserKey]: userData.id,
    status: "IN_PROGRESS",
  };

  const { error } = await client
    .from(Tables.GAMES_DATA)
    .update(updatedData)
    .eq("id", data.id);

  if (error) throw error;

  const newData = {
    ...data,
    ...updatedData,
  };

  return newData;
}

async function createChessGame(config: z.infer<typeof CONFIG_SCHEMA>) {
  const client = await createClient();
  const userData = await UserService.getUserData(client);
  const randomUserKey = Math.random() < 0.5 ? "user_white_id" : "user_black_id";

  let data: z.infer<typeof MATCH_MAKING_SCHEMA> = structuredClone({
    ...INITIAL_MATCHMAKING_STATE,
    type: config.type,
    session_type: config.session_type,
    status: config.type === "engine" ? "IN_PROGRESS" : "IN_QUEUE",
    engine_difficulty: config.type === "engine" ? config.engine_difficulty : null,
    [randomUserKey]: userData.id,
  });

  if (config.type === "engine") {
    const engineKey =
      randomUserKey === "user_white_id" ? "user_black_id" : "user_white_id";
    data[engineKey] = "engine";
  }

  const { data: insertData, error: insertError } = await client
    .from(Tables.GAMES_DATA)
    .insert({ ...data })
    .select("id")
    .single();

  if (insertError) throw insertError;

  const parseData = RAW_GAME_SCHEMA.pick({ id: true }).parse(insertData);
  return parseData.id;
}

async function cancelLastGame() {
  const client = await createClient();
  const userData = await UserService.getUserData(client);

  const { data, error } = await client
    .from(Tables.GAMES_DATA)
    .select("*")
    .in("status", ["IN_QUEUE", "IN_PROGRESS"])
    .or(`user_white_id.eq.${userData.id},user_black_id.eq.${userData.id}`)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return;

  const parsedData = RAW_GAME_SCHEMA.parse(data);

  // Cancel game if it is in queue
  if (parsedData.status === "IN_QUEUE") {
    const { error: cancelError } = await client
      .from(Tables.GAMES_DATA)
      .update({ status: "CANCELLED" })
      .eq("id", parsedData.id);
    if (cancelError) throw cancelError;
    return;
  }

  // Hardforce finish game if it is in progress
  if (parsedData.status === "IN_PROGRESS") {
    await updateSurrenderGameData(parsedData, userData);
  }
}

async function updateSurrenderGameData(
  data: z.infer<typeof SURRENDER_SCHEMA>,
  userData: SupabaseSafeUser
) {
  const client = await createClient();
  const winner =
    data.user_white_id === userData.id
      ? data.user_black_id
      : data.user_white_id;

  const { error: updateError } = await client
    .from(Tables.GAMES_DATA)
    .update({ winner_id: winner, game_state: "SURRENDER", status: "FINISHED" })
    .eq("id", data.id);

  if (updateError) throw updateError;
}

export {
  joinExistingGame,
  createChessGame,
  cancelLastGame,
  updateSurrenderGameData,
  updateJoinGameData,
};
