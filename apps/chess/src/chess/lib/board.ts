import { ChessState } from "../context/chess-state-manager";

type WPieces = "r" | "n" | "b" | "q" | "k" | "p";
type BPieces = "R" | "N" | "B" | "Q" | "K" | "P";
type BoardValue = WPieces | BPieces | null

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

export { initialBoard, type WPieces, type BPieces, type Board, type BoardValue };
