/**
 * Shared play utils module.
 * Used across different features when querying play related data.
 */

import { DbPlayTableRow } from "@/services/supabase/types";



function doesGameStarted(game: Pick<DbPlayTableRow, "white_player" | "black_player">) {
  return !!game.white_player && !!game.black_player;
}

export {doesGameStarted};