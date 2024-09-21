import { SupabaseClient } from "@supabase/supabase-js";
import { generateFen } from "chess-lite/fen";

import { ChessState } from "@/features/chess/store/definitions";
import { convertMoveHistoryToString } from "@/features/chess/store/helpers";

import { createClient } from "@/services/supabase/client";
import { Tables } from "@/services/supabase/tables";

async function sendGameDataToSupabase(
  state: ChessState,
  client?: SupabaseClient<any, "public", any>
) {
  const supabase = client ?? createClient();

  const { data: historyData, error: historyError } = await supabase
    .from(Tables.GAMES_DATA)
    .select("history")
    .eq("id", state.id)
    .single<{history: string[]}>();
    
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

export { sendGameDataToSupabase };
