import {RAW_GAME_SCHEMA} from "@/services/supabase/models";
import {z} from "zod";
import {generateFen, parseFen} from "chess-lite/fen";

import {ChessState, ChessStateFromRaw} from "../store/definitions";
import {convertMoveHistoryToString, parseMoveHistory} from "./resolvers";

// Only send a mutable values, as others will not change/are not needed
const DATA_SCHEMA = RAW_GAME_SCHEMA.pick({
  fen: true,
  game_state: true,
  moves_history: true,
  winner_id: true,
  history: true,
  status: true,
});

function convertStateToRaw(state: ChessState): z.infer<typeof DATA_SCHEMA> {
  const fen = generateFen(state);
  const movesHistory = convertMoveHistoryToString(state.movesHistory);

  const data = {
    fen,
    moves_history: movesHistory,
    game_state: state.gameState,
    winner_id: state.winnerId,
    history: state.history,
    status: state.status,
  };

  const parsedData = DATA_SCHEMA.parse(data);

  return parsedData;
}

function convertRawToState(raw: unknown): ChessStateFromRaw {
  const parsedData = RAW_GAME_SCHEMA.parse(raw);

  const {
    fen,
    moves_history,
    user_white_id,
    user_black_id,
    winner_id,
    game_state,
    session_type,
    engine_difficulty,
    ...rest
  } = parsedData;

  const dataFromFen = parseFen(fen);
  const parsedHistory = parseMoveHistory(moves_history);

  return {
    ...dataFromFen,
    ...rest,
    movesHistory: parsedHistory,
    gameState: game_state,
    winnerId: winner_id,
    userWhiteId: user_white_id,
    userBlackId: user_black_id,
    sessionType: session_type,
    engineDifficulty: engine_difficulty,
  };
}

export {convertStateToRaw, convertRawToState};
