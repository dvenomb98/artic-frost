import { RAW_GAME_SCHEMA } from "@/services/supabase/models";
import { z } from "zod";
import { generateFen, parseFen } from "chess-lite/fen";

import { ChessState, ChessStateFromRaw } from "../store/definitions";
import { convertMoveHistoryToString, parseMoveHistory } from "./resolvers";

// Only send a mutable values, as others will not change/are not needed
const DATA_SCHEMA = RAW_GAME_SCHEMA.pick({
  fen: true,
  gameState: true,
  movesHistory: true,
  winnerId: true,
  history: true,
  status: true,
});

function convertStateToRaw(state: ChessState): z.infer<typeof DATA_SCHEMA> {
  const fen = generateFen(state);
  const movesHistory = convertMoveHistoryToString(state.movesHistory);

  const data = {
    fen,
    movesHistory,
    gameState: state.gameState,
    winnerId: state.winnerId,
    history: state.history,
    status: state.status,
  };

  const parsedData = DATA_SCHEMA.parse(data);

  return parsedData;
}

function convertRawToState(raw: unknown): ChessStateFromRaw {
  const parsedData = RAW_GAME_SCHEMA.parse(raw);

  const { fen, movesHistory, ...rest } = parsedData;
  const dataFromFen = parseFen(fen);
  const parsedHistory = parseMoveHistory(parsedData.movesHistory);

  return {
    ...dataFromFen,
    ...rest,
    movesHistory: parsedHistory,
  };
}

export { convertStateToRaw, convertRawToState };
