import { isWhitePiece } from "chess-lite/lib/board";
import { BoardValue, Move } from "./definitions";

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

function convertMoveHistoryToString(history: Move[]) {
  let string = "";
  if (!history?.length) return string;
  for (const move of history) {
    string += `${move.piece}${move.colIndex}${move.rowIndex}${move.prevColIndex}${move.prevRowIndex}${move.isEnPassant ? "t" : "f"}${move.isCastle ? "t" : "f"}`;
  }
  return string;
}

function parseMoveHistory(historyString: string) {
  let history: Move[] = [];
  if (!historyString?.length) return history;

  for (let i = 0; i < historyString.length; i += 7) {
    const piece = historyString[i] as BoardValue;
    const colIndex = parseInt(historyString[i + 1]!);
    const rowIndex = parseInt(historyString[i + 2]!);
    const prevColIndex = parseInt(historyString[i + 3]!);
    const prevRowIndex = parseInt(historyString[i + 4]!);
    const isEnPassant = historyString[i + 5] === "t";
    const isCastle = historyString[i + 6] === "t";
    history.push({
      piece,
      colIndex,
      rowIndex,
      prevColIndex,
      prevRowIndex,
      isEnPassant,
      isCastle,
    });
  }

  return history;
}

export { isCastleMove, parseMoveHistory, convertMoveHistoryToString };
