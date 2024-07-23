type WPieces = "r" | "n" | "b" | "q" | "k" | "p";
type BPieces = "R" | "N" | "B" | "Q" | "K" | "P";
type BoardValue = WPieces | BPieces | null;

type Board = BoardValue[][];

const initialBoard: Board = [
  ["r", "n", "b", "q", "k", "b", "n", "r"], // 1st row (black pieces)
  ["p", "p", "p", "p", "p", "p", "p", "p"], // 2nd row (black pawns)
  [null, null, null, null, null, null, null, null], // 3rd row
  [null, null, null, null, null, null, null, null], // 4th row
  [null, null, null, null, null, null, null, null], // 5th row
  [null, null, null, null, null, null, null, null], // 6th row
  ["P", "P", "P", "P", "P", "P", "P", "P"], // 7th row (white pawns)
  ["R", "N", "B", "Q", "K", "B", "N", "R"], // 8th row (white pieces)
];

interface SelectedPiece {
  rowIndex: number | null;
  colIndex: number | null;
  piece: BoardValue | null;
}

type OnTurn = "WHITE" | "BLACK";

type GameState =  "CHECKMATE" | "DRAW" | "";
interface ChessUser {
  role: OnTurn;
  id: string | null;
}

type CastleAbility = Record<OnTurn, { short: boolean; long: boolean }>;

type EnPassantTargetSquareMove = {
  colIndex: number | null;
  rowIndex: number | null;
};
interface PossibleMoves {
  rowIndex: number;
  colIndex: number;
  isCastle: boolean;
  isEnPassant: boolean;
}

interface FenState {
  castleAbility: CastleAbility;
  enPassantTargetSquare: EnPassantTargetSquareMove;
  onTurn: OnTurn;
  fullMoves: number;
  halfMoves: number;
}

interface FenBoardState extends FenState {
  boardState: Board;
}

type MoveHistory = {
  colIndex: number;
  rowIndex: number;
}

interface ChessState extends FenState {
  boardState: Board;
  selectedPiece: SelectedPiece;
  possibleMoves: PossibleMoves[];
  gameState: GameState;
  users: ChessUser[];
  id: string
  currentUserId: string
  movesHistory: MoveHistory[]
}

const initialState: ChessState = {
  // - Dont send to database -
  selectedPiece: { rowIndex: null, colIndex: null, piece: null },
  possibleMoves: [],
  // - Dont send to database -

  // - Parsed from fen -
  boardState: initialBoard,
  castleAbility: {
    WHITE: {
      short: true,
      long: true,
    },
    BLACK: {
      short: true,
      long: true,
    },
  },
  enPassantTargetSquare: {
    colIndex: null,
    rowIndex: null,
  },
  onTurn: "WHITE",
  fullMoves: 1,
  halfMoves: 0,
  // - Parsed from fen -

  // - Additional required info -
  id: "",
  gameState: "",
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
  movesHistory: []
  // - Additional required info
};



export {
  initialBoard,
  initialState,
  type WPieces,
  type BPieces,
  type Board,
  type BoardValue,
  type ChessState,
  type FenBoardState,
  type FenState,
  type PossibleMoves,
  type EnPassantTargetSquareMove,
  type CastleAbility,
  type ChessUser,
  type GameState,
  type OnTurn,
  type SelectedPiece,
  type MoveHistory
};
