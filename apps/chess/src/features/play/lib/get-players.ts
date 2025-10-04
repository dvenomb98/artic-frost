import {
  DbPlayTableRow,
  DbPlayTableRowPlayerKeys,
} from "@/services/supabase/types";
import {User} from "@supabase/supabase-js";
import type {Player} from "wasm-chess";

type Players = {
  current: {key: DbPlayTableRowPlayerKeys; value: Player};
  opponent: {key: DbPlayTableRowPlayerKeys; value: Player};
};

function getPlayers(
  game: Pick<DbPlayTableRow, "white_player" | "black_player">,
  userId: string
): Players {
  if (userId === game.white_player) {
    return {
      current: {key: "white_player", value: "White"},
      opponent: {key: "black_player", value: "Black"},
    };
  }
  return {
    current: {key: "black_player", value: "Black"},
    opponent: {key: "white_player", value: "White"},
  };
}

export {getPlayers, type Players};
