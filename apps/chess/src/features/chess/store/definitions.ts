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
  timestamp: string;
};

type GameType = "vs" | "engine";

interface ChessState extends FenState {
  selectedPiece: Square | null;
  possibleMoves: Move[];
  gameState: GameState;
  users: ChessUser[];
  id: string;
  type: GameType;
  currentUserId: string;
  movesHistory: Move[];
  chat: Chat[];
  winnerId: string | null;
}

const INITIAL_CHESS_STATE: ChessState = {
  // - Dont send to database -
  selectedPiece: null,
  possibleMoves: [],
  // - Dont send to database -

  // Parsed from fen
  ...INITIAL_FEN_STATE,
  // Parsed from fen

  // - Additional extended info -
  ...INITIAL_GAME_RESULT,
  id: "",
  type: "vs",
  winnerId: null,
  currentUserId: "",
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
  // - Additional extended info
};

export {
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
