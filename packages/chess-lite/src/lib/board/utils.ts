import { FenState, Move, Square } from "chess-lite/definitions";
import {
  isWhitePiece,
  copyBoard,
  mutateBoard,
  isSquareAttacked,
  validatePiece,
  getNextPlayer,
} from "./helpers";
import { calculatePossibleMoves } from "../moves/utils";

/*
  This function validates a list of moves based on the current game state and the piece being moved.
  It ensures that the moves do not put the current player's king in check.
  It also handles special rules for castling moves.
*/
function validateMoves(
  moves: Move[],
  state: FenState,
  payload: Square
): Move[] {
  let validatedMoves: Move[] = [];

  const { colIndex, rowIndex, piece } = payload;
  const { board, onTurn, castleAbility } = state;

  if (colIndex === null || rowIndex === null || !piece) {
    return [];
  }

  const isWhite = isWhitePiece(piece);
  const kingPiece = isWhite ? "K" : "k";

  for (const move of moves) {
    const nextBoard = mutateBoard(move, board);

    let isCheck = false;
    let kingPosition = { rowIndex: -1, colIndex: -1 };
    let opponentPieces = [];

    for (const [rowIndex, row] of nextBoard.entries()) {
      for (const [colIndex, col] of row.entries()) {
        if (col === kingPiece) {
          kingPosition = { rowIndex, colIndex };
        }

        if (!!col && !validatePiece(col, isWhite)) {
          opponentPieces.push({ rowIndex, colIndex, piece: col });
        }
      }
    }
    for (const opponentPiece of opponentPieces) {
      const opponentMoves = calculatePossibleMoves(
        { ...state, board: nextBoard },
        opponentPiece
      );

      const findedCheck = opponentMoves.some(
        pM =>
          pM.colIndex === kingPosition.colIndex &&
          pM.rowIndex === kingPosition.rowIndex
      );


      if (findedCheck) {
        isCheck = true;
        break;
      }
    }

    if (!isCheck) {
      validatedMoves.push(move);
    }
  }
  if (piece !== kingPiece) {
    return validatedMoves;
  }

  const row = isWhite ? 7 : 0;

  if (castleAbility[onTurn].short) {

    const shortCastlePath = [
      { rowIndex: row, colIndex: 4 },
      { rowIndex: row, colIndex: 5 },
      { rowIndex: row, colIndex: 6 },
    ];

    const canCastleShort = shortCastlePath.every(square => {
      return !isSquareAttacked(state, square, onTurn);
    });

    if (!canCastleShort) {
      validatedMoves = validatedMoves.filter(move => move.colIndex !== 6);
    }
  }

  if (castleAbility[onTurn].long) {
    const longCastlePath = [
      { rowIndex: row, colIndex: 4 },
      { rowIndex: row, colIndex: 3 },
      { rowIndex: row, colIndex: 2 },
    ];

    const canLongCastle = longCastlePath.every(square => {
      return !isSquareAttacked(state, square, onTurn);
    });

    if (!canLongCastle) {
      validatedMoves = validatedMoves.filter(move => move.colIndex !== 2);
    }
  }

  return validatedMoves;
}

export { validateMoves };
