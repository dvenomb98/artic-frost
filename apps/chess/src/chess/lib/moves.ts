import { ChessState, PossibleMoves, SelectedPiece } from "@/chess/context/chess-state-manager";
import { calculateMovesByDirection, getOpponentPieces } from "./helpers";

function calculatePossibleMoves(state: ChessState, payload: SelectedPiece): PossibleMoves[] {
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

export { calculatePossibleMoves };

const directionsStraight = [
  { incRow: 1, incCol: 0 }, // up
  { incRow: 0, incCol: -1 }, // right
  { incRow: -1, incCol: 0 }, // down
  { incRow: 0, incCol: 1 }, // left
];

const directionsDiagonal = [
  { incRow: 1, incCol: -1 }, // diag.left up
  { incRow: -1, incCol: -1 }, // diag.left down
  { incRow: 1, incCol: 1 }, // diag.right up
  { incRow: -1, incCol: 1 }, // diag.right down
];

const knightDirections = [
  { incRow: 2, incCol: -1 }, // up-left
  { incRow: 2, incCol: 1 }, // up-right
  { incRow: 1, incCol: -2 }, // left-up
  { incRow: 1, incCol: 2 }, // left-down
  { incRow: -2, incCol: 1 }, // down-right
  { incRow: -2, incCol: -1 }, // down-left
  { incRow: -1, incCol: -2 }, // right-up
  { incRow: -1, incCol: 2 }, // right-down
];

function calcPawnMoves(state: ChessState, payload: SelectedPiece): PossibleMoves[] {
  let possibleMoves: PossibleMoves[] = [];
  const { boardState } = state;
  const { rowIndex, colIndex, piece } = payload;

  if (rowIndex === null || colIndex === null) {
    return possibleMoves;
  }

  const isWhite = piece === "P";
  const direction = isWhite ? -1 : 1;
  const startRow = isWhite ? 6 : 1;
  const opponentPieces = getOpponentPieces(isWhite);

  // Move forward by 1
  const nextRow = rowIndex + direction;
  if (boardState[nextRow]?.[colIndex] === null) {
    possibleMoves.push({ rowIndex: nextRow, colIndex });
    // Move forward by 2 if at starting position
    const twoStepsRow = nextRow + direction;
    if (rowIndex === startRow && boardState[twoStepsRow]?.[colIndex] === null) {
      possibleMoves.push({ rowIndex: twoStepsRow, colIndex });
    }
  }

  // Capture to right
  const rightSquare = boardState[nextRow]?.[colIndex + 1];
  if (!!rightSquare && opponentPieces.includes(rightSquare)) {
    possibleMoves.push({ rowIndex: nextRow, colIndex: colIndex + 1 });
  }

  // Capture to left
  const leftSquare = boardState[nextRow]?.[colIndex - 1];
  if (!!leftSquare && opponentPieces.includes(leftSquare)) {
    possibleMoves.push({ rowIndex: nextRow, colIndex: colIndex - 1 });
  }

  // Elpassant

  return possibleMoves;
}

function calcBishopMoves(state: ChessState, payload: SelectedPiece): PossibleMoves[] {
  let possibleMoves: PossibleMoves[] = [];
  calculateMovesByDirection(state, payload, directionsDiagonal, possibleMoves)

  return possibleMoves;
}

function calcRookMoves(state: ChessState, payload: SelectedPiece): PossibleMoves[] {
  let possibleMoves: PossibleMoves[] = [];
  calculateMovesByDirection(state, payload, directionsStraight, possibleMoves);

  return possibleMoves;
}

function calcQueenMoves(state: ChessState, payload: SelectedPiece): PossibleMoves[] {
  let possibleMoves: PossibleMoves[] = [];
  const directions = [...directionsStraight, ...directionsDiagonal];
  calculateMovesByDirection(state, payload, directions, possibleMoves);

  return possibleMoves;
}

function calcKingMoves(state: ChessState, payload: SelectedPiece): PossibleMoves[] {
  let possibleMoves: PossibleMoves[] = [];
  const directions = [...directionsStraight, ...directionsDiagonal];
  calculateMovesByDirection(state, payload, directions, possibleMoves, true);

  return possibleMoves;
}

function calcKnightMoves(state: ChessState, payload: SelectedPiece): PossibleMoves[] {
  let possibleMoves: PossibleMoves[] = [];
  calculateMovesByDirection(state, payload, knightDirections, possibleMoves, true);

  return possibleMoves;
}
