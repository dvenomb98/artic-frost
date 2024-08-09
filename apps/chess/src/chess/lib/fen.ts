import {
  FenBoardState,
  FenState,
  OnTurn,
  Board,
  BoardValue,
  MoveHistory
} from "@/chess/lib/definitions";

const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const stringToColMap: { [key: string]: number } = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
};

function convertColToString(col: number): string {
  return Object.keys(stringToColMap).find((key) => stringToColMap[key] === col)!;
}

function splitByFirstWhitespace(str: string): string[] {
  const index = str.indexOf(" ");
  const firstPart = str.substring(0, index);
  const secondPart = str.substring(index + 1);
  return [firstPart, secondPart];
}

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

function convertFenValuesToState(fen: string): FenState {
  const secondHalf = splitByFirstWhitespace(fen)[1]!;
  const fenValuesArray = secondHalf.split(/(\s+)/).filter((e) => !!e.trim());

  let state: FenState = {
    onTurn: "" as OnTurn,
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
    enPassantTargetSquare: {
      rowIndex: null,
      colIndex: null,
    },
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
      colIndex: +stringToColMap[enPassantValues[0]!]!,
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

function convertStateToFen(state: FenBoardState): string {
  const { onTurn, halfMoves, fullMoves, castleAbility, enPassantTargetSquare } = state;
  let fen = "";

  fen += onTurn === "WHITE" ? "w" : "b";
  fen += " ";

  if (
    Object.values(castleAbility.WHITE).every((v) => !v) &&
    Object.values(castleAbility.BLACK).every((v) => !v)
  ) {
    fen += "-";
  } else {
    if (castleAbility.WHITE.short) fen += "K";
    if (castleAbility.WHITE.long) fen += "Q";
    if (castleAbility.BLACK.short) fen += "k";
    if (castleAbility.BLACK.long) fen += "q";
  }
  fen += " ";

  if (enPassantTargetSquare.colIndex && enPassantTargetSquare.rowIndex) {
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

function generateFen(state: FenBoardState): string {
  const firstPart = convertBoardToFen(state.boardState);
  const secondPart = convertStateToFen(state);
  return firstPart + " " + secondPart;
}

function parseFen(fen: string): FenBoardState {
  const boardState = convertFenToBoard(fen);
  const state = convertFenValuesToState(fen);
  return { ...state, boardState };
}

function convertMoveHistoryToString(history: MoveHistory[]) {
  let string = "";
  if (!history?.length) return string;
  for (const move of history) {
    string += `${move.piece}${move.colIndex}${move.rowIndex}${move.prevColIndex}${move.prevRowIndex}${move.isEnPassant ? "t" : "f"}${move.isCastle ? "t" : "f"}`;
  }
  return string;
}

function parseMoveHistory(historyString: string) {
  let history: MoveHistory[] = [];
  if (!historyString?.length) return history;

  for (let i = 0; i < historyString.length; i += 7) {
    const piece = historyString[i] as BoardValue
    const colIndex = parseInt(historyString[i + 1]!);
    const rowIndex = parseInt(historyString[i + 2]!);
    const prevColIndex = parseInt(historyString[i + 3]!);
    const prevRowIndex = parseInt(historyString[i + 4]!);
    const isEnPassant = historyString[i + 5] === "t"
    const isCastle = historyString[i + 6] === "t"
    history.push({ piece, colIndex, rowIndex, prevColIndex, prevRowIndex, isEnPassant, isCastle });
  }

  return history;
}

export {
  generateFen,
  parseFen,
  convertColToString,
  convertMoveHistoryToString,
  parseMoveHistory,
  initialFen,
};
