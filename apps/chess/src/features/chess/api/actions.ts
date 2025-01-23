"use server";

import { generateFen } from "chess-lite/fen";

import { createClient } from "@/services/supabase/server";
import { ChessState } from "@/features/chess/store/definitions";
import { Tables } from "@/services/supabase/tables";
import { ProvidedClient } from "@/services/supabase/definitions";

import { convertMoveHistoryToString } from "../store/helpers";

async function createUserHistory(
  game_id: string,
  providedClient?: ProvidedClient
) {
  const client = providedClient ?? (await createClient());
  console.log("I AM CALLED", game_id)

  const { error } = await client
    .from(Tables.USER_GAMES_HISTORY)
    .insert({ game_id });

  if (error) throw error;
}

async function sendGameDataToSupabase(state: ChessState) {
  const supabase = await createClient();

  const { data: historyData, error: historyError } = await supabase
    .from(Tables.GAMES_DATA)
    .select("history")
    .eq("id", state.id)
    .single<{ history: string[] }>();

  if (historyError) throw historyError;

  const fen = generateFen(state);
  const movesHistory = convertMoveHistoryToString(state.movesHistory);

  // Only send a mutable values, as others will not change/are not needed
  const data = {
    fen,
    gameState: state.gameState,
    movesHistory,
    winnerId: state.winnerId,
    history: [...historyData.history, fen],
  };

  const { error } = await supabase
    .from(Tables.GAMES_DATA)
    .update(data)
    .eq("id", state.id);

  if (error) {
    throw error;
  }
}

export { sendGameDataToSupabase, createUserHistory };
