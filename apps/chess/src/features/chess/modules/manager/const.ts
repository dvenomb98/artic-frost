import {z} from "zod";

import {
  INITIAL_CHESS_STATE,
  INITIAL_FEN_POSITION,
} from "@chess/store/definitions";
import {MATCH_MAKING_SCHEMA} from "./models";

const INITIAL_MATCHMAKING_STATE: Omit<
  z.infer<typeof MATCH_MAKING_SCHEMA>,
  "type" | "session_type" | "status"
> = {
  fen: INITIAL_FEN_POSITION,
  user_white_id: null,
  user_black_id: null,
  chat: INITIAL_CHESS_STATE.chat,
  winner_id: null,
  moves_history: "",
  history: [INITIAL_FEN_POSITION],
  game_state: INITIAL_CHESS_STATE.gameState,
  engine_difficulty: null,
};

export {INITIAL_MATCHMAKING_STATE};
