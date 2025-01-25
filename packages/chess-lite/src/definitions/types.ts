type WPieces = "r" | "n" | "b" | "q" | "k" | "p";
type BPieces = "R" | "N" | "B" | "Q" | "K" | "P";
type BoardValue = WPieces | BPieces | null;
type Board = BoardValue[][];

interface Square {
  rowIndex: number;
  colIndex: number;
  piece: BoardValue;
}

interface Move extends Square {
  prevColIndex: number;
  prevRowIndex: number;
  isCastle: boolean;
  isEnPassant: boolean;
}

type GameState = "CHECKMATE" | "DRAW" | "SURRENDER" | null;
type Player = "WHITE" | "BLACK";
type CastleAbility = Record<Player, { short: boolean; long: boolean }>;
type EnPassantTargetSquareMove = {
  colIndex: number;
  rowIndex: number;
};

interface FenState {
  board: Board;
  castleAbility: CastleAbility;
  enPassantTargetSquare: EnPassantTargetSquareMove | null;
  onTurn: Player;
  fullMoves: number;
  halfMoves: number;
}

interface GameResult {
  gameState: GameState;
  winner: Player | null;
}

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
};
