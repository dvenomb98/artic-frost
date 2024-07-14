import { Board, BoardValue } from "./board";

type UnknownBoardType = string | number;

const stringToColMap: {[key: string]: number} = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7
}

function splitByFirstWhitespace(str: string): string[] {
    const index = str.indexOf(" ")
    const firstPart = str.substring(0, index)
    const secondPart = str.substring(index + 1)
    return [firstPart, secondPart]
    
}

function convertFenToBoard(fen: string): Board {
  let board: Board = [[]];
  let counter = 0;
  const firstHalf = splitByFirstWhitespace(fen)[0]!

  for (const val of firstHalf) {
    const number = Number(val);

    if (Number.isNaN(number)) {
      // create a new row
      if (board[counter]! && val === "/") {
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


function convertFenValuesToState(fen: string) {
    const secondHalf = splitByFirstWhitespace(fen)[1]!
    const fenValuesArray = secondHalf.split(/(\s+)/).filter(e => !!e.trim())
    console.log(fenValuesArray)
    console.log(fen)

    let state = {
        onTurn: "",
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
            colIndex: null
          },
          halfMoves: 0,
          fullMoves: 0
    }
    // Calculate player on turn
    state.onTurn = fenValuesArray[0] === "w" ? "WHITE" : "BLACK"

    // Calculate castle ability
    const castleAbility = fenValuesArray[1]!
    if(castleAbility !== "-") {
        state.castleAbility ={
            WHITE: {
                short: castleAbility.includes("K"),
                long: castleAbility.includes("Q")
            },
            BLACK: {
                short: castleAbility.includes("k"),
                long: castleAbility.includes("q")
            }
        }
    }

    const enPassant = fenValuesArray[2]!
    if(enPassant !== "-") {
        const enPassantValues = enPassant.split("")
        state.enPassantTargetSquare = {
            //@ts-expect-error null 
            colIndex: stringToColMap[enPassantValues[0] as string]!,
            //@ts-expect-error null 
            rowIndex: enPassantValues[1]!
        }
    }

    state.halfMoves = +fenValuesArray[3]!
    state.fullMoves = +fenValuesArray[4]!

    return state
}

export { convertFenToBoard, convertFenValuesToState, type UnknownBoardType };
