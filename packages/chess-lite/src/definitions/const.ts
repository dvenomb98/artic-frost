import {Board, FenState, GameResult} from "./types";

const WHITE_PIECES = ["P", "R", "N", "B", "Q", "K"];
const BLACK_PIECES = ["p", "r", "n", "b", "q", "k"];
const EN_PASSANT_PIECES = ["P", "p"];

const INITIAL_BOARD: Board = [
  ["r", "n", "b", "q", "k", "b", "n", "r"], // 1st row (black pieces)
  ["p", "p", "p", "p", "p", "p", "p", "p"], // 2nd row (black pawns)
  [null, null, null, null, null, null, null, null], // 3rd row
  [null, null, null, null, null, null, null, null], // 4th row
  [null, null, null, null, null, null, null, null], // 5th row
  [null, null, null, null, null, null, null, null], // 6th row
  ["P", "P", "P", "P", "P", "P", "P", "P"], // 7th row (white pawns)
  ["R", "N", "B", "Q", "K", "B", "N", "R"], // 8th row (white pieces)
];

const INITIAL_FEN_STATE: FenState = {
  board: INITIAL_BOARD,
  castleAbility: {
    WHITE: {short: true, long: true},
    BLACK: {short: true, long: true},
  },
  enPassantTargetSquare: null,
  onTurn: "WHITE",
  fullMoves: 0,
  halfMoves: 0,
};

const INITIAL_GAME_RESULT: GameResult = {
  gameState: null,
  winner: null,
};

export {
  WHITE_PIECES,
  BLACK_PIECES,
  INITIAL_BOARD,
  INITIAL_FEN_STATE,
  EN_PASSANT_PIECES,
  INITIAL_GAME_RESULT,
};
