import { CHAT_SCHEMA, GAME_TYPE_SCHEMA, SESSION_TYPE_SCHEMA } from "@/services/supabase/models";
import { STATUS_SCHEMA } from "@/services/supabase/models";
import {
  type WPieces,
  type BPieces,
  type Board,
  type BoardValue,
  type FenState,
  type EnPassantTargetSquareMove,
  type CastleAbility,
  type GameState,
  type Move,
  type Player,
  type Square,
  type GameResult,
  WHITE_PIECES,
  BLACK_PIECES,
  INITIAL_BOARD,
  INITIAL_FEN_STATE,
  EN_PASSANT_PIECES,
  INITIAL_GAME_RESULT,
} from "chess-lite/definitions";

import { INITIAL_FEN_POSITION } from "chess-lite/fen";
import { z } from "zod";

type Chat = z.infer<typeof CHAT_SCHEMA>;
type GameType = z.infer<typeof GAME_TYPE_SCHEMA>;
type Status = z.infer<typeof STATUS_SCHEMA>;
type SessionType = z.infer<typeof SESSION_TYPE_SCHEMA>;

interface InternalChessState {
  selectedPiece: Square | null;
  possibleMoves: Move[];
}

interface ChessStateFromRaw extends FenState {
  gameState: GameState;
  userWhiteId: string | null;
  userBlackId: string | null;
  id: number;
  type: GameType;
  movesHistory: Move[];
  chat: Chat[];
  winnerId: string | null;
  history: string[];
  status: Status;
  sessionType: SessionType;
}

interface ChessState extends InternalChessState, ChessStateFromRaw {
  currentUserId: string;
}

const INITIAL_CHESS_STATE: Omit<
  ChessState,
  "id" | "currentUserId" | "history" | "sessionType"
> = {
  // - Dont send to database -
  selectedPiece: null,
  possibleMoves: [],
  // - Dont send to database -

  // Parsed from fen
  ...INITIAL_FEN_STATE,
  // Parsed from fen

  // - Additional extended info -
  ...INITIAL_GAME_RESULT,
  type: "vs",
  winnerId: null,
  userWhiteId: null,
  userBlackId: null,
  movesHistory: [],
  chat: [],
  status: "IN_QUEUE",
  // - Additional extended info
};

export {
  type ChessStateFromRaw,
  type InternalChessState,
  type WPieces,
  type BPieces,
  type Board,
  type BoardValue,
  type FenState,
  type EnPassantTargetSquareMove,
  type CastleAbility,
  type GameState,
  type Move,
  type Player,
  type Square,
  type GameResult,
  type Chat,
  type Status,
  type GameType,
  type ChessState,
  INITIAL_FEN_POSITION,
  WHITE_PIECES,
  BLACK_PIECES,
  INITIAL_BOARD,
  INITIAL_FEN_STATE,
  EN_PASSANT_PIECES,
  INITIAL_GAME_RESULT,
  INITIAL_CHESS_STATE,
};
