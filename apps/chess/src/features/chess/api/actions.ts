"use server";

import { createClient } from "@/services/supabase/server";
import { ChessState } from "@/features/chess/store/definitions";
import { Tables } from "@/services/supabase/tables";
import {
  ProvidedClient,
} from "@/services/supabase/models";


import { convertStateToRaw } from "./utils";

async function createUserHistory(
  game_id: string,
  providedClient?: ProvidedClient
) {
  const client = providedClient ?? (await createClient());

  const { error } = await client
    .from(Tables.USER_GAMES_HISTORY)
    .insert({ game_id });

  if (error) throw error;
}

async function sendGameDataToSupabase(state: ChessState) {
  const supabase = await createClient();

  const data = convertStateToRaw(state);

  console.log(data);

  const { error } = await supabase
    .from(Tables.GAMES_DATA)
    .update(data)
    .eq("id", state.id);

  if (error) {
    throw error;
  }
}

export { sendGameDataToSupabase, createUserHistory };
