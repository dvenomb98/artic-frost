"use server";

import {createClient} from "@/services/supabase/server";
import {ChessState} from "@chess/store/definitions";
import {Tables} from "@/services/supabase/tables";

import {convertStateToRaw} from "./utils";

async function sendGameDataToSupabase(state: ChessState) {
  const supabase = await createClient();

  const data = convertStateToRaw(state);

  const {error} = await supabase
    .from(Tables.GAMES_DATA)
    .update(data)
    .eq("id", state.id);

  if (error) {
    throw error;
  }
}

export {sendGameDataToSupabase};
