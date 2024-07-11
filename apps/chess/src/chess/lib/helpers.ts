import { ChessState, PossibleMoves, SelectedPiece } from "../context/chess-state-manager";
import { Board } from "./board";

function getOpponentPieces(isWhite: boolean) {
  return isWhite ? ["p", "r", "n", "b", "q", "k"] : ["P", "R", "N", "B", "Q", "K"];
}

function isWhitePiece(s: string | null) {
  if (!s) return false;

  return s === s.toUpperCase();
}

function calculateMovesByDirection(
  state: ChessState,
  payload: SelectedPiece,
  directions: { incRow: number; incCol: number }[],
  possibleMoves: PossibleMoves[],
  loopOnce?: boolean
) {
  const { boardState } = state;
  const { rowIndex, colIndex, piece } = payload;

  if (rowIndex === null || colIndex === null) {
    return possibleMoves;
  }

  const isWhite = isWhitePiece(piece);
  const opponentPieces = getOpponentPieces(isWhite);
  const args = { rowIndex, colIndex, possibleMoves, opponentPieces, boardState };

  for (const direction of directions) {
    addMoves(direction.incRow, direction.incCol, args, loopOnce);
  }
}

function addMoves(
  incRow: number,
  incCol: number,
  args: {
    rowIndex: number;
    colIndex: number;
    possibleMoves: PossibleMoves[];
    opponentPieces: string[];
    boardState: Board;
  },
  loopOnce?: boolean
) {
  const { rowIndex, colIndex, possibleMoves, boardState, opponentPieces } = args;
  let currentRow = rowIndex! + incRow;
  let currentCol = colIndex! + incCol;

  while (currentRow >= 0 && currentRow < 8 && currentCol >= 0 && currentCol < 8) {
    const currentCell = boardState[currentRow]?.[currentCol];

    if (currentCell === undefined) break;

    if (currentCell === null) {
      possibleMoves.push({ rowIndex: currentRow, colIndex: currentCol });
    } else if (opponentPieces.includes(currentCell)) {
      possibleMoves.push({ rowIndex: currentRow, colIndex: currentCol });
      break;
    } else break;

    if (loopOnce) break;

    currentRow += incRow;
    currentCol += incCol;
  }
}

export { getOpponentPieces, addMoves, calculateMovesByDirection };
