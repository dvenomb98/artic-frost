import { Board, BoardValue, FenState, Player } from "chess-lite/definitions";

import {
  convertColToString,
  STRING_TO_COL_MAP
} from "chess-lite/lib/board";
import { splitByFirstWhitespace } from "./helpers";

function convertFenToBoard(fen: string): Board {
  let board: Board = [[]];
  let counter = 0;
  const firstHalf = splitByFirstWhitespace(fen)[0]!;

  for (const val of firstHalf) {
    const number = Number(val);

    if (Number.isNaN(number)) {
      // handle strings
      // create a new row
      if (board[counter] && val === "/") {
        board.push([]);
        counter++;
        continue;
      }
      board[counter]?.push(val as BoardValue);
    }
    if (Number.isSafeInteger(number)) {
      // handle numbers
      for (let i = 0; i < number; i++) {
        board[counter]?.push(null);
      }
    }
  }
  return board;
}

function convertFenToState(fen: string) {
  const secondHalf = splitByFirstWhitespace(fen)[1]!;
  const fenValuesArray = secondHalf.split(/(\s+)/).filter(e => !!e.trim());

  let state: Omit<FenState, "board"> = {
    onTurn: "" as Player,
    castleAbility: {
      WHITE: {
        short: false,
        long: false,
      },
      BLACK: {
        short: false,
        long: false,
      },
    },
    enPassantTargetSquare: null,
    halfMoves: 0,
    fullMoves: 0,
  };

  // Calculate player on turn
  state.onTurn = fenValuesArray[0] === "w" ? "WHITE" : "BLACK";

  // Calculate castle ability
  const castleAbility = fenValuesArray[1]!;
  if (castleAbility !== "-") {
    state.castleAbility = {
      WHITE: {
        short: castleAbility.includes("K"),
        long: castleAbility.includes("Q"),
      },
      BLACK: {
        short: castleAbility.includes("k"),
        long: castleAbility.includes("q"),
      },
    };
  }

  const enPassant = fenValuesArray[2]!;
  if (enPassant !== "-") {
    const enPassantValues = enPassant.split("");
    state.enPassantTargetSquare = {
      colIndex: +STRING_TO_COL_MAP[enPassantValues[0]!]!,
      rowIndex: +enPassantValues[1]!,
    };
  }
  state.halfMoves = +fenValuesArray[3]!;
  state.fullMoves = +fenValuesArray[4]!;

  return state;
}

function convertBoardToFen(board: Board): string {
  let fen = "";

  for (const row of board) {
    let counter = 0;
    if (fen) {
      fen += "/";
    }
    for (const [colIndex, col] of row.entries()) {
      if (typeof col === "string") {
        if (counter !== 0) {
          fen += counter.toString();
          counter = 0;
        }
        fen += col;
      } else {
        counter++;
        if (colIndex === 7) {
          fen += counter.toString();
          counter = 0;
        }
      }
    }
  }
  return fen;
}

function convertStateToFen(
  state: FenState
): string {
  const { onTurn, halfMoves, fullMoves, castleAbility, enPassantTargetSquare } =
    state;
  let fen = "";

  fen += onTurn === "WHITE" ? "w" : "b";
  fen += " ";

  if (
    Object.values(castleAbility.WHITE).every(v => !v) &&
    Object.values(castleAbility.BLACK).every(v => !v)
  ) {
    fen += "-";
  } else {
    if (castleAbility.WHITE.short) fen += "K";
    if (castleAbility.WHITE.long) fen += "Q";
    if (castleAbility.BLACK.short) fen += "k";
    if (castleAbility.BLACK.long) fen += "q";
  }
  fen += " ";

  if (enPassantTargetSquare) {
    fen += convertColToString(enPassantTargetSquare.colIndex);
    fen += enPassantTargetSquare.rowIndex;
  } else {
    fen += "-";
  }
  fen += " ";

  fen += halfMoves;
  fen += " ";
  fen += fullMoves;

  return fen;
}

function generateFen(state: FenState): string {
  const firstPart = convertBoardToFen(state.board);
  const secondPart = convertStateToFen(state);
  return firstPart + " " + secondPart;
}

function parseFen(fen: string): FenState {
  const board = convertFenToBoard(fen);
  const state = convertFenToState(fen);
  return { ...state, board };
}

export {
  convertFenToBoard,
  convertFenToState,
  convertBoardToFen,
  convertStateToFen,
  parseFen,
  generateFen,
};