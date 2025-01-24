import { BoardValue, GameState, Move } from "chess-lite/definitions";
import { ChessState, Status } from "../store/definitions";

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


export { convertMoveHistoryToString, parseMoveHistory };
