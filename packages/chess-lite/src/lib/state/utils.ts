import {
  BoardValue,
  Move,
  EN_PASSANT_PIECES,
  FenState,
  GameState,
} from "chess-lite/definitions";
import {
  BREAK_CASTLE_PIECES,
  getKingPosition,
  getCurrentPieces,
  isSquareAttacked,
  isWhitePiece,
  validateMoves,
} from "../board";
import { calculatePossibleMoves } from "../moves";

function getNextHalfMoves(
  piece: BoardValue,
  targetPiece: BoardValue,
  currentMoves: number
): number {
  let halfMoves = currentMoves;
  // Reset to 0 on Pawn Move:
  if (piece === "p" || piece === "P") return 0;

  // Reset to 0 on Capture
  if (targetPiece) return 0;

  // Increment on Other Moves
  halfMoves += 1;

  return halfMoves;
}

function getNextCastleAbility(move: Move, state: FenState) {
  const { castleAbility, onTurn } = state;

  const castleIsAvailable =
    castleAbility[onTurn].long || castleAbility[onTurn].long;
  if (!castleIsAvailable) return castleAbility;

  const pieceType = move.piece;
  if (!pieceType || !BREAK_CASTLE_PIECES[onTurn].includes(pieceType))
    return castleAbility;

  const nextCastleAbility = { ...castleAbility };

  switch (pieceType) {
    case "K":
      nextCastleAbility["WHITE"].short = false;
      nextCastleAbility["WHITE"].long = false;
      break;
    case "k":
      nextCastleAbility["BLACK"].short = false;
      nextCastleAbility["BLACK"].long = false;
      break;
    case "R":
      if (move.prevColIndex === 0) {
        nextCastleAbility["WHITE"].long = false;
      } else if (move.prevColIndex === 7) {
        nextCastleAbility["WHITE"].short = false;
      }
      break;
    case "r":
      if (move.prevColIndex === 0) {
        nextCastleAbility["BLACK"].long = false;
      } else if (move.prevColIndex === 7) {
        nextCastleAbility["BLACK"].short = false;
      }
      break;
  }

  return nextCastleAbility;
}

function getEnPassantTargetSquare(move: Move) {
  if (!EN_PASSANT_PIECES.includes(move.piece || "")) return null;

  const isWhite = isWhitePiece(move.piece);

  const rowDiff = Math.abs(move.rowIndex - move.prevRowIndex);
  const colDiff = Math.abs(move.colIndex - move.prevColIndex);

  // En passant move for a pawn happens when it moves two squares forward from its starting position
  if (!isWhite) {
    if (move.prevRowIndex === 1 && rowDiff === 2 && colDiff === 0) {
      return {
        colIndex: move.colIndex,
        rowIndex: move.rowIndex - 1,
      };
    }
  } else {
    if (move.prevRowIndex === 6 && rowDiff === 2 && colDiff === 0) {
      return {
        colIndex: move.colIndex,
        rowIndex: move.rowIndex + 1,
      };
    }
  }

  return null;
}

function getGameState(state: FenState): GameState {
  const { onTurn, board, halfMoves } = state;

  // Check for draw by 50-move rule
  if (halfMoves >= 100) {
    return "DRAW";
  }

  const kingPosition = getKingPosition(onTurn === "WHITE", board);
  const isKingInCheck = isSquareAttacked(state, kingPosition, onTurn);
  const currentPieces = getCurrentPieces(onTurn === "WHITE", board);

  for (const piece of currentPieces) {
    const possibleMoves = calculatePossibleMoves(state, piece);
    const validatedMoves = validateMoves(possibleMoves, state, piece);
    if (validatedMoves.length > 0) {
      return null;
    }
  }

  return isKingInCheck ? "CHECKMATE" : "DRAW";
}

export {
  getNextHalfMoves,
  getNextCastleAbility,
  getEnPassantTargetSquare,
  getGameState,
};
