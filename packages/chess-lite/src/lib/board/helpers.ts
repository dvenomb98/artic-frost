import {
  BLACK_PIECES,
  Player,
  WHITE_PIECES,
  Board,
  FenState,
  Move,
  Square,
} from "chess-lite/definitions";
import { STRING_TO_COL_MAP } from "./const";
import { DELETE_COUNT } from "./const";
import { calculatePossibleMoves } from "chess-lite/lib/moves";

function convertColToString(col: number): string {
  return Object.keys(STRING_TO_COL_MAP).find(
    key => STRING_TO_COL_MAP[key] === col
  )!;
}

function getOpponentPieces(isWhite: boolean) {
  return isWhite ? BLACK_PIECES : WHITE_PIECES;
}

function isWhitePiece(s: string | null) {
  if (!s) return false;

  return s === s.toUpperCase();
}

function validatePiece(piece: string, isWhite: boolean) {
  return isWhite
    ? piece === piece.toUpperCase()
    : piece !== piece.toUpperCase();
}

function getNextPlayer(player: Player) {
  return player === "WHITE" ? "BLACK" : "WHITE";
}

function copyBoard(board: Board) {
  return board.map(row => [...row]);
}

function mutateBoard(move: Move, board: Board) {
  if (move.colIndex === null || move.rowIndex === null) return;

  const isWhite = isWhitePiece(move.piece);

  board[move.rowIndex]?.splice(move.colIndex, DELETE_COUNT, null);
  board[move.rowIndex]?.splice(move.colIndex, DELETE_COUNT, move.piece);

  if (move.isEnPassant) {
    const incRowIndex = isWhite ? 1 : -1;
    board[move.rowIndex + incRowIndex]?.splice(
      move.colIndex,
      DELETE_COUNT,
      null
    );
  }

  if ((move.isCastle && move.piece === "K") || move.piece === "k") {
    const kingTargetCol = move.colIndex;
    const rookSourceCol = kingTargetCol === 6 ? 7 : 0;
    const rookTargetCol = kingTargetCol === 6 ? 5 : 3;
    board[move.rowIndex]?.splice(rookSourceCol, DELETE_COUNT, null);
    board[move.rowIndex]?.splice(
      rookTargetCol,
      DELETE_COUNT,
      isWhite ? "R" : "r"
    );
  }

  const upgradeTargetRow = isWhite ? 0 : 7;
  const upgradeTargetPiece = isWhite ? "P" : "p";

  if (move.rowIndex === upgradeTargetRow && move.piece === upgradeTargetPiece) {
    const newPiece = isWhite ? "Q" : "q";
    board[move.rowIndex]?.splice(move.colIndex, DELETE_COUNT, newPiece);
  }
}

function getKingPosition(
  isWhite: boolean,
  board: Board
): { rowIndex: number; colIndex: number } {
  const kingPiece = isWhite ? "K" : "k";

  for (const [rowIndex, row] of board.entries()) {
    for (const [colIndex, col] of row.entries()) {
      if (col === kingPiece) {
        return { rowIndex, colIndex };
      }
    }
  }

  // Should never reach here if a king is always on the board
  return { rowIndex: -1, colIndex: -1 };
}

function getCurrentPieces(isWhite: boolean, board: Board): Square[] {
  const pieces = [];

  for (const [rowIndex, row] of board.entries()) {
    for (const [colIndex, col] of row.entries()) {
      if (col !== null && validatePiece(col, isWhite)) {
        pieces.push({ rowIndex, colIndex, piece: col });
      }
    }
  }

  return pieces;
}

function isSquareAttacked(
  state: FenState,
  square: { rowIndex: number; colIndex: number },
  onTurn: Player
): boolean {
  const { board } = state;
  const nextPlayer = getNextPlayer(onTurn);
  const opponentPieces = getCurrentPieces(nextPlayer === "WHITE", board);

  for (const opponentPiece of opponentPieces) {
    const opponentMoves = calculatePossibleMoves(state, opponentPiece);
    if (
      opponentMoves.some(
        pM => pM.colIndex === square.colIndex && pM.rowIndex === square.rowIndex
      )
    ) {
      return true;
    }
  }

  return false;
}

function getSquarePiece(colIndex: number, rowIndex: number, board: Board) {
  for (const [rowI, row] of board.entries()) {
    for (const [colI, piece] of row.entries()) {
      if (colI === colIndex && rowI === rowIndex) {
        return piece ?? null;
      }
    }
  }
}

export {
  copyBoard,
  mutateBoard,
  getKingPosition,
  getCurrentPieces,
  isSquareAttacked,
  convertColToString,
  getOpponentPieces,
  isWhitePiece,
  validatePiece,
  getNextPlayer,
  getSquarePiece,
};
