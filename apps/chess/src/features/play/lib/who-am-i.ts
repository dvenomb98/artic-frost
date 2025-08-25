import {
  DbPlayTableRow,
  DbPlayTableRowPlayerKeys,
} from "@/services/supabase/types";
import {User} from "@supabase/supabase-js";
import {Player} from "wasm-chess";

function whoAmI(
  game: DbPlayTableRow,
  user: User
): {
  key: DbPlayTableRowPlayerKeys;
  value: Player;
} {
  if (user.id === game.white_player) {
    return {key: "white_player", value: "White"};
  }
  return {key: "black_player", value: "Black"};
}

export {whoAmI};
