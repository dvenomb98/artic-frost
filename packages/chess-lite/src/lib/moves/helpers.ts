import {
  FenState,
  Square,
  Move,
  Board,
  BoardValue,
} from "chess-lite/definitions";
import { getOpponentPieces, isWhitePiece } from "chess-lite/lib/board";
import {
  directionsDiagonal,
  directionsStraight,
  knightDirections,
} from "./const";

function calculateMovesByDirection(
  state: FenState,
  payload: Square,
  possibleMoves: Move[],
  directions: { incRow: number; incCol: number }[],
  loopOnce?: boolean
) {
  const { board } = state;
  const { rowIndex, colIndex, piece } = payload;

  if (rowIndex === null || colIndex === null) {
    return possibleMoves;
  }

  const isWhite = isWhitePiece(piece);
  const opponentPieces = getOpponentPieces(isWhite);
  const args = {
    rowIndex,
    colIndex,
    possibleMoves,
    opponentPieces,
    board,
    piece,
  };

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
    possibleMoves: Move[];
    opponentPieces: string[];
    board: Board;
    piece: BoardValue;
  },
  loopOnce?: boolean
) {
  const { rowIndex, colIndex, possibleMoves, board, opponentPieces, piece } =
    args;
  let currentRow = rowIndex! + incRow;
  let currentCol = colIndex! + incCol;

  while (
    currentRow >= 0 &&
    currentRow < 8 &&
    currentCol >= 0 &&
    currentCol < 8
  ) {
    const currentCell = board[currentRow]?.[currentCol];

    if (currentCell === undefined) break;

    if (currentCell === null) {
      possibleMoves.push({
        rowIndex: currentRow,
        colIndex: currentCol,
        isCastle: false,
        isEnPassant: false,
        prevRowIndex: rowIndex,
        prevColIndex: colIndex,
        piece,
      });
    } else if (opponentPieces.includes(currentCell)) {
      possibleMoves.push({
        rowIndex: currentRow,
        colIndex: currentCol,
        isCastle: false,
        isEnPassant: false,
        prevRowIndex: rowIndex,
        prevColIndex: colIndex,
        piece,
      });
      break;
    } else break;

    if (loopOnce) break;

    currentRow += incRow;
    currentCol += incCol;
  }
}

function calculateCastleMoves(
  state: FenState,
  payload: Square,
  possibleMoves: Move[]
) {
  const { board, castleAbility } = state;
  const { rowIndex, colIndex, piece } = payload;

  if (rowIndex === null || colIndex === null) {
    return possibleMoves;
  }

  const isWhite = isWhitePiece(piece);

  const player = isWhite ? "WHITE" : "BLACK";
  const kingInitialRow = isWhite ? 7 : 0;
  const kingInitialCol = 4;
  const rookShortCol = 7;
  const rookLongCol = 0;
  const pieceIsKing = piece === (isWhite ? "K" : "k");

  if (!pieceIsKing) {
    return possibleMoves;
  }

  const canCastleShort = castleAbility[player].short;
  const canCastleLong = castleAbility[player].long;

  if (
    pieceIsKing &&
    rowIndex === kingInitialRow &&
    colIndex === kingInitialCol
  ) {
    if (canCastleShort) {
      const shortPathClear =
        board[kingInitialRow]?.[kingInitialCol + 1] === null &&
        board[kingInitialRow]?.[kingInitialCol + 2] === null;
      if (
        shortPathClear &&
        board[kingInitialRow]?.[rookShortCol] === (isWhite ? "R" : "r")
      ) {
        possibleMoves.push({
          rowIndex: kingInitialRow,
          colIndex: kingInitialCol + 2,
          isCastle: true,
          isEnPassant: false,
          prevRowIndex: kingInitialRow,
          prevColIndex: kingInitialCol,
          piece,
        });
      }
    }

    if (canCastleLong) {
      const longPathClear =
        board[kingInitialRow]?.[kingInitialCol - 1] === null &&
        board[kingInitialRow]?.[kingInitialCol - 2] === null &&
        board[kingInitialRow]?.[kingInitialCol - 3] === null;
      if (
        longPathClear &&
        board[kingInitialRow]?.[rookLongCol] === (isWhite ? "R" : "r")
      ) {
        possibleMoves.push({
          rowIndex: kingInitialRow,
          colIndex: kingInitialCol - 2,
          isCastle: true,
          isEnPassant: false,
          prevRowIndex: kingInitialRow,
          prevColIndex: kingInitialCol,
          piece,
        });
      }
    }
  }
}

function calcPawnMoves(state: FenState, payload: Square): Move[] {
  let possibleMoves: Move[] = [];
  const { board, enPassantTargetSquare } = state;
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
  if (board[nextRow]?.[colIndex] === null) {
    possibleMoves.push({
      rowIndex: nextRow,
      colIndex,
      isCastle: false,
      isEnPassant: false,
      piece,
      prevRowIndex: rowIndex,
      prevColIndex: colIndex,
    });
    // Move forward by 2 if at starting position
    const twoStepsRow = nextRow + direction;
    if (rowIndex === startRow && board[twoStepsRow]?.[colIndex] === null) {
      possibleMoves.push({
        rowIndex: twoStepsRow,
        colIndex,
        isCastle: false,
        isEnPassant: false,
        piece,
        prevRowIndex: rowIndex,
        prevColIndex: colIndex,
      });
    }
  }

  // Capture to right
  const rightSquare = board[nextRow]?.[colIndex + 1];
  if (!!rightSquare && opponentPieces.includes(rightSquare)) {
    possibleMoves.push({
      rowIndex: nextRow,
      colIndex: colIndex + 1,
      isCastle: false,
      isEnPassant: false,
      piece,
      prevRowIndex: rowIndex,
      prevColIndex: colIndex,
    });
  }

  // Capture to left
  const leftSquare = board[nextRow]?.[colIndex - 1];
  if (!!leftSquare && opponentPieces.includes(leftSquare)) {
    possibleMoves.push({
      rowIndex: nextRow,
      colIndex: colIndex - 1,
      isCastle: false,
      isEnPassant: false,
      piece,
      prevRowIndex: rowIndex,
      prevColIndex: colIndex,
    });
  }

  // EnPassant
  if (enPassantTargetSquare) {
    if (
      rowIndex + direction === enPassantTargetSquare.rowIndex &&
      (colIndex + 1 === enPassantTargetSquare.colIndex ||
        colIndex - 1 === enPassantTargetSquare.colIndex)
    ) {
      possibleMoves.push({
        rowIndex: enPassantTargetSquare.rowIndex,
        colIndex: enPassantTargetSquare.colIndex,
        isCastle: false,
        isEnPassant: true,
        piece,
        prevRowIndex: rowIndex,
        prevColIndex: colIndex,
      });
    }
  }

  return possibleMoves;
}

function calcBishopMoves(state: FenState, payload: Square): Move[] {
  let possibleMoves: Move[] = [];
  calculateMovesByDirection(
    state,
    payload,
    possibleMoves,
    directionsDiagonal,
    true
  );
  return possibleMoves;
}

function calcRookMoves(state: FenState, payload: Square): Move[] {
  let possibleMoves: Move[] = [];
  calculateMovesByDirection(
    state,
    payload,
    possibleMoves,
    directionsStraight,
    true
  );
  return possibleMoves;
}

  function calcQueenMoves(state: FenState, payload: Square): Move[] {
  const directions = [...directionsStraight, ...directionsDiagonal];
  let possibleMoves: Move[] = [];
  calculateMovesByDirection(state, payload, possibleMoves, directions, true);
  return possibleMoves;
}

  function calcKingMoves(state: FenState, payload: Square): Move[] {
  let possibleMoves: Move[] = [];
  const directions = [...directionsStraight, ...directionsDiagonal];
  calculateMovesByDirection(state, payload, possibleMoves, directions, true);
  calculateCastleMoves(state, payload, possibleMoves);

  return possibleMoves;
}

function calcKnightMoves(state: FenState, payload: Square): Move[] {
  let possibleMoves: Move[] = [];
  calculateMovesByDirection(
    state,
    payload,
    possibleMoves,
    knightDirections,
    true
  );

  return possibleMoves;
}

export {
  calcPawnMoves,
  calcBishopMoves,
  calcRookMoves,
  calcQueenMoves,
  calcKingMoves,
  calcKnightMoves,
  calculateMovesByDirection,
};
