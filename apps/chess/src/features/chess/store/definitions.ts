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

type ChessUser = {
  role: Player;
  id: string | null;
};

type Chat = {
  userId: string;
  text: string;
  timestamp: number;
};

type GameType = "vs" | "engine";
type Status = "IN_QUEUE" | "IN_PROGRESS" | "FINISHED";

interface InternalChessState {
  selectedPiece: Square | null;
  possibleMoves: Move[];
}

interface ChessStateFromRaw extends FenState {
  gameState: GameState;
  users: ChessUser[];
  id: number;
  type: GameType;
  movesHistory: Move[];
  chat: Chat[];
  winnerId: string | null;
  history: string[];
  status: Status;
}

interface ChessState extends InternalChessState, ChessStateFromRaw {
  currentUserId: string;
}

const INITIAL_CHESS_STATE: Omit<ChessState, "id" | "currentUserId" | "history"> = {
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
  users: [
    {
      role: "WHITE",
      id: null,
    },
    {
      role: "BLACK",
      id: null,
    },
  ],
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
  type ChessUser,
  type Chat,
  type Status,
  type GameType,
  type ChessState,
  WHITE_PIECES,
  BLACK_PIECES,
  INITIAL_BOARD,
  INITIAL_FEN_STATE,
  EN_PASSANT_PIECES,
  INITIAL_GAME_RESULT,
  INITIAL_CHESS_STATE,
};
