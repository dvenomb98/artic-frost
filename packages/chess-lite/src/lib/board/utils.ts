import { FenState, Move, Square } from "@/definitions";
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

  // This code block implements a crucial chess rule: validating moves to prevent the king from being left in check. It operates as follows:
  // 1. Iterates through each potential move
  // 2. Simulates the move on a copy of the board
  // 3. Checks if the resulting position leaves the current player's king vulnerable:
  //    - Locates the king's new position
  //    - Calculates all possible moves for each opponent's piece
  //    - Determines if any opponent's move can capture the king
  // 4. If the move doesn't result in check, it's added to the list of valid moves

  // This process ensures that only legal moves that don't endanger the king are allowed,
  // maintaining the integrity of chess rules.
  for (const move of moves) {
    const nextBoard = copyBoard(board);
    mutateBoard(move, nextBoard);

    let isCheck = false;
    let kingPosition = { rowIndex: -1, colIndex: -1 };
    let opponentPieces = [];

    for (const [rowIndex, row] of board.entries()) {
      for (const [colIndex, col] of row.entries()) {
        if (col === kingPiece) {
          kingPosition = { rowIndex, colIndex };
        }

        if (col && validatePiece(col, isWhite)) {
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
  /*
  This block handles special rules for castling moves:
  1. It only applies to king moves (checked by piece !== kingPiece)
  2. For each castling direction (short and long):
     - Defines the path the king would take
     - Checks if any square along the path is under attack
     - If the path is safe, keeps the castling move; otherwise, removes it
  3. This ensures castling is only allowed when:
     - The king has castling rights (checked by castleAbility)
     - The path is clear of attacks (a requirement for legal castling)
  */
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
      return !isSquareAttacked(state, square, getNextPlayer(onTurn));
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
