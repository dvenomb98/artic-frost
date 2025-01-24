import { isWhitePiece } from "chess-lite/lib/board";
import { GameState, Move, Status } from "./definitions";

// TODO: Add to chess-lite
function isCastleMove(
  move: Pick<Move, "prevColIndex" | "colIndex" | "prevRowIndex" | "piece">
): boolean {
  if (move.piece === "k" || move.piece === "K") {
    const isWhite = isWhitePiece(move.piece);
    const kingRowIndex = isWhite ? 0 : 7;

    // Check if the king is moving two squares horizontally (castling)
    const isKingSideCastle =
      move.prevColIndex === 4 &&
      move.colIndex === 6 &&
      move.prevRowIndex === kingRowIndex;
    const isQueenSideCastle =
      move.prevColIndex === 4 &&
      move.colIndex === 2 &&
      move.prevRowIndex === kingRowIndex;

    // If either condition is true, it’s a castle
    if (isKingSideCastle || isQueenSideCastle) {
      return true;
    }
  }

  return false;
}

function getStatus(gameState: GameState, status: Status): Status {
  if (
    gameState === "CHECKMATE" ||
    gameState === "DRAW" ||
    gameState === "SURRENDER"
  )
    return "FINISHED";

  return status
}

export { isCastleMove, getStatus };
