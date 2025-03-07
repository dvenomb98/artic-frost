import {FenState, Square, Move} from "chess-lite/definitions";
import {
  calcBishopMoves,
  calcRookMoves,
  calcQueenMoves,
  calcKingMoves,
  calcKnightMoves,
  calcPawnMoves,
} from "./helpers";

function calculatePossibleMoves(state: FenState, payload: Square): Move[] {
  switch (payload.piece) {
    case "P":
    case "p":
      return calcPawnMoves(state, payload);
    case "B":
    case "b":
      return calcBishopMoves(state, payload);
    case "R":
    case "r":
      return calcRookMoves(state, payload);
    case "Q":
    case "q":
      return calcQueenMoves(state, payload);
    case "K":
    case "k":
      return calcKingMoves(state, payload);
    case "N":
    case "n":
      return calcKnightMoves(state, payload);
    default:
      return [];
  }
}

export {calculatePossibleMoves};
