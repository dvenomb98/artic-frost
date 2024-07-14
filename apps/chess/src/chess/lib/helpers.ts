import {
  CastleAbility,
  ChessState,
  OnTurn,
  PossibleMoves,
  SelectedPiece,
} from "../context/chess-state-manager";
import { Board } from "./board";
import { calculatePossibleMoves } from "./moves";

const whitePieces = ["P", "R", "N", "B", "Q", "K"];
const blackPieces = ["p", "r", "n", "b", "q", "k"];
const enPassantPieces = ["P", "p"];
const DELETE_COUNT = 1;
const breakCastlePieces = {
  WHITE: ["K", "R"],
  BLACK: ["k", "r"],
};

function getOpponentAllPieces(isWhite: boolean) {
  return isWhite ? blackPieces : whitePieces;
}

function isWhitePiece(s: string | null) {
  if (!s) return false;

  return s === s.toUpperCase();
}

function calculateOnTurnPlayer(onTurn: OnTurn) {
  return onTurn === "WHITE" ? "BLACK" : "WHITE";
}

function copyBoard(board: Board) {
  return board.map((row) => [...row]);
}

function calculateEnPassantTargetSquare(
  selectedMove: PossibleMoves,
  previousSelectedPiece: SelectedPiece
) {
  if (
    previousSelectedPiece.colIndex === null ||
    previousSelectedPiece.rowIndex === null ||
    !previousSelectedPiece.piece
  )
    return;
  if (selectedMove.colIndex === null || selectedMove.rowIndex === null) return;

  if (!enPassantPieces.includes(previousSelectedPiece.piece)) return null;

  const isWhite = isWhitePiece(previousSelectedPiece.piece);

  const rowDiff = Math.abs(selectedMove.rowIndex - previousSelectedPiece.rowIndex);
  const colDiff = Math.abs(selectedMove.colIndex - previousSelectedPiece.colIndex);

  // En passant move for a pawn happens when it moves two squares forward from its starting position
  if (!isWhite) {
    if (previousSelectedPiece.rowIndex === 1 && rowDiff === 2 && colDiff === 0) {
      return {
        colIndex: selectedMove.colIndex,
        rowIndex: selectedMove.rowIndex - 1,
      };
    }
  } else {
    if (previousSelectedPiece.rowIndex === 6 && rowDiff === 2 && colDiff === 0) {
      return {
        colIndex: selectedMove.colIndex,
        rowIndex: selectedMove.rowIndex + 1,
      };
    }
  }

  return null;
}

function calculateCastleMoves(
  state: ChessState,
  payload: SelectedPiece,
  possibleMoves: PossibleMoves[]
) {
  const { boardState, castleAbility } = state;
  const { rowIndex, colIndex, piece } = payload;

  if (rowIndex === null || colIndex === null) {
    return possibleMoves;
  }

  const isWhite = isWhitePiece(piece);

  const player = isWhite ? "WHITE" : "BLACK";
  const kingInitialRow = isWhite ? 7 : 0;
  const kingInitialCol = 4;
  const rookShortCol = 7;
  const rookLongCol = 0;
  const pieceIsKing = piece === (isWhite ? "K" : "k");

  if (!pieceIsKing) {
    return possibleMoves;
  }

  const canCastleShort = castleAbility[player].short;
  const canCastleLong = castleAbility[player].long;

  if (pieceIsKing && rowIndex === kingInitialRow && colIndex === kingInitialCol) {
    if (canCastleShort) {
      const shortPathClear =
        boardState[kingInitialRow]?.[kingInitialCol + 1] === null &&
        boardState[kingInitialRow]?.[kingInitialCol + 2] === null;
      if (shortPathClear && boardState[kingInitialRow]?.[rookShortCol] === (isWhite ? "R" : "r")) {
        possibleMoves.push({
          rowIndex: kingInitialRow,
          colIndex: kingInitialCol + 2,
          isCastle: true,
          isEnPassant: false,
        });
      }
    }

    if (canCastleLong) {
      const longPathClear =
        boardState[kingInitialRow]?.[kingInitialCol - 1] === null &&
        boardState[kingInitialRow]?.[kingInitialCol - 2] === null &&
        boardState[kingInitialRow]?.[kingInitialCol - 3] === null;
      if (longPathClear && boardState[kingInitialRow]?.[rookLongCol] === (isWhite ? "R" : "r")) {
        possibleMoves.push({
          rowIndex: kingInitialRow,
          colIndex: kingInitialCol - 2,
          isCastle: true,
          isEnPassant: false,
        });
      }
    }
  }

  return possibleMoves;
}

function calculateMovesByDirection(
  state: ChessState,
  payload: SelectedPiece,
  directions: { incRow: number; incCol: number }[],
  possibleMoves: PossibleMoves[],
  loopOnce?: boolean
) {
  const { boardState } = state;
  const { rowIndex, colIndex, piece } = payload;

  if (rowIndex === null || colIndex === null) {
    return possibleMoves;
  }

  const isWhite = isWhitePiece(piece);
  const opponentPieces = getOpponentAllPieces(isWhite);
  const args = { rowIndex, colIndex, possibleMoves, opponentPieces, boardState };

  for (const direction of directions) {
    addMoves(direction.incRow, direction.incCol, args, loopOnce);
  }
}

function addMoves(
  incRow: number,
  incCol: number,
  args: {
    rowIndex: number;
    colIndex: number;
    possibleMoves: PossibleMoves[];
    opponentPieces: string[];
    boardState: Board;
  },
  loopOnce?: boolean
) {
  const { rowIndex, colIndex, possibleMoves, boardState, opponentPieces } = args;
  let currentRow = rowIndex! + incRow;
  let currentCol = colIndex! + incCol;

  while (currentRow >= 0 && currentRow < 8 && currentCol >= 0 && currentCol < 8) {
    const currentCell = boardState[currentRow]?.[currentCol];

    if (currentCell === undefined) break;

    if (currentCell === null) {
      possibleMoves.push({
        rowIndex: currentRow,
        colIndex: currentCol,
        isCastle: false,
        isEnPassant: false,
      });
    } else if (opponentPieces.includes(currentCell)) {
      possibleMoves.push({
        rowIndex: currentRow,
        colIndex: currentCol,
        isCastle: false,
        isEnPassant: false,
      });
      break;
    } else break;

    if (loopOnce) break;

    currentRow += incRow;
    currentCol += incCol;
  }
}

function getOpponentCurrentPieces(target: "WHITE" | "BLACK", boardState: Board): SelectedPiece[] {
  const opponentPieces = [];

  function validatePiece(str: string) {
    return target === "WHITE" ? str === str.toUpperCase() : str !== str.toUpperCase();
  }

  for (const [rowIndex, row] of boardState.entries()) {
    for (const [colIndex, col] of row.entries()) {
      if (col !== null && validatePiece(col)) {
        opponentPieces.push({ rowIndex, colIndex, piece: col });
      }
    }
  }

  return opponentPieces;
}

function findKingPosition(
  target: "WHITE" | "BLACK",
  boardState: Board
): { rowIndex: number; colIndex: number } {
  const kingPiece = target === "WHITE" ? "K" : "k";

  for (const [rowIndex, row] of boardState.entries()) {
    for (const [colIndex, col] of row.entries()) {
      if (col === kingPiece) {
        return { rowIndex, colIndex };
      }
    }
  }

  return { rowIndex: -1, colIndex: -1 }; // Should never reach here if a king is always on the board
}

function mutateBoard(
  selectedMove: PossibleMoves,
  board: Board,
  previousSelectedPiece: SelectedPiece,
  onTurn: OnTurn
) {
  if (
    previousSelectedPiece.colIndex === null ||
    previousSelectedPiece.rowIndex === null ||
    !previousSelectedPiece.piece
  )
    return;
  if (selectedMove.colIndex === null || selectedMove.rowIndex === null) return;

  board[previousSelectedPiece.rowIndex]?.splice(previousSelectedPiece.colIndex, DELETE_COUNT, null);
  board[selectedMove.rowIndex]?.splice(
    selectedMove.colIndex,
    DELETE_COUNT,
    previousSelectedPiece.piece
  );

  if (selectedMove.isEnPassant) {
    const incRowIndex = isWhitePiece(previousSelectedPiece.piece) ? 1 : -1;
    board[selectedMove.rowIndex + incRowIndex]?.splice(selectedMove.colIndex, DELETE_COUNT, null);
  }

  if (
    selectedMove.isCastle &&
    (previousSelectedPiece.piece === "K" || previousSelectedPiece.piece === "k")
  ) {
    const kingTargetCol = selectedMove.colIndex;
    const rookSourceCol = kingTargetCol === 6 ? 7 : 0;
    const rookTargetCol = kingTargetCol === 6 ? 5 : 3;
    board[selectedMove.rowIndex]?.splice(rookSourceCol, DELETE_COUNT, null);
    board[selectedMove.rowIndex]?.splice(
      rookTargetCol,
      DELETE_COUNT,
      onTurn === "WHITE" ? "R" : "r"
    );
  }

  const isWhite = onTurn === "WHITE";
  const upgradeTargetRow = isWhite ? 0 : 7;
  const upgradeTargetPiece = isWhite ? "P" : "p";

  if (
    selectedMove.rowIndex === upgradeTargetRow &&
    previousSelectedPiece.piece === upgradeTargetPiece
  ) {
    const newPiece = isWhite ? "Q" : "q";
    board[selectedMove.rowIndex]?.splice(selectedMove.colIndex, DELETE_COUNT, newPiece);
  }
}

function mutateCastleAbility(
  castleAbility: CastleAbility,
  previousSelectedPiece: SelectedPiece,
  onTurn: OnTurn
) {
  const castleIsAvailable = castleAbility[onTurn].long || castleAbility[onTurn].long;
  if (!castleIsAvailable) return castleAbility;

  const pieceType = previousSelectedPiece.piece;
  if (!pieceType || !breakCastlePieces[onTurn].includes(pieceType)) return castleAbility;

  const newCastleAbility = { ...castleAbility };

  switch (pieceType) {
    case "K":
      newCastleAbility["WHITE"].short = false;
      newCastleAbility["WHITE"].long = false;
      break;
    case "k":
      newCastleAbility["BLACK"].short = false;
      newCastleAbility["BLACK"].long = false;
      break;
    case "R":
      if (previousSelectedPiece.colIndex === 0) {
        newCastleAbility["WHITE"].long = false;
      } else if (previousSelectedPiece.colIndex === 7) {
        newCastleAbility["WHITE"].short = false;
      }
      break;
    case "r":
      if (previousSelectedPiece.colIndex === 0) {
        newCastleAbility["BLACK"].long = false;
      } else if (previousSelectedPiece.colIndex === 7) {
        newCastleAbility["BLACK"].short = false;
      }
      break;
  }

  return newCastleAbility;
}

function validateMoves(
  moves: PossibleMoves[],
  state: ChessState,
  payload: SelectedPiece
): PossibleMoves[] {
  const { colIndex, rowIndex, piece } = payload;
  const { boardState, onTurn, castleAbility } = state;
  let validatedMoves: PossibleMoves[] = [];

  if (colIndex !== null && rowIndex !== null && piece) {
    const target = calculateOnTurnPlayer(onTurn);

    for (const move of moves) {
      const newBoard = copyBoard(boardState);
      mutateBoard(move, newBoard, payload, onTurn);

      let isCheck = false;
      const kingPosition = findKingPosition(onTurn, newBoard);
      const opponentPieces = getOpponentCurrentPieces(target, newBoard);

      for (const opponentPiece of opponentPieces) {
        const opponentMoves = calculatePossibleMoves(
          { ...state, boardState: newBoard },
          opponentPiece
        );
        const findedCheck = opponentMoves.some(
          (pM) => pM.colIndex === kingPosition.colIndex && pM.rowIndex === kingPosition.rowIndex
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

    //
    // Validate castle if needed
    //
    const isWhite = isWhitePiece(piece);
    if (piece !== (isWhite ? "K" : "k")) return validatedMoves;

    const row = isWhite ? 7 : 0;

    if (castleAbility[onTurn].short) {
      const shortCastlePath = [
        { rowIndex: row, colIndex: 4 },
        { rowIndex: row, colIndex: 5 },
        { rowIndex: row, colIndex: 6 },
      ];

      const canCastleShort = shortCastlePath.every((square) => {
        return !isSquareAttacked(state, square);
      });

      if (!canCastleShort) {
        validatedMoves = validatedMoves.filter((move) => move.colIndex !== 6);
      }
    }

    if (castleAbility[onTurn].long) {
      const longCastlePath = [
        { rowIndex: row, colIndex: 4 },
        { rowIndex: row, colIndex: 3 },
        { rowIndex: row, colIndex: 2 },
      ];

      const canLongCastle = longCastlePath.every((square) => {
        return !isSquareAttacked(state, square);
      });

      if (!canLongCastle) {
        validatedMoves = validatedMoves.filter((move) => move.colIndex !== 2);
      }
    }
  }

  return validatedMoves;
}

function isSquareAttacked(
  state: ChessState,
  square: { rowIndex: number; colIndex: number }
): boolean {
  const { onTurn, boardState } = state;
  const target = calculateOnTurnPlayer(onTurn);
  const opponentPieces = getOpponentCurrentPieces(target, boardState);

  for (const opponentPiece of opponentPieces) {
    const opponentMoves = calculatePossibleMoves(state, opponentPiece);
    if (
      opponentMoves.some((pM) => pM.colIndex === square.colIndex && pM.rowIndex === square.rowIndex)
    ) {
      return true;
    }
  }

  return false;
}

function validateCheckmate(state: ChessState): boolean {
  const { onTurn, boardState } = state;
  const target = calculateOnTurnPlayer(onTurn);
  const kingPosition = findKingPosition(target, boardState);

  const isKingInCheck = isSquareAttacked({ ...state, onTurn: target }, kingPosition);

  if (!isKingInCheck) return false;

  const currentOpponentPieces = getOpponentCurrentPieces(target, boardState);

  for (const currentPiece of currentOpponentPieces) {
    const possibleMoves = calculatePossibleMoves(state, currentPiece);
    const validatedMoves = validateMoves(possibleMoves, { ...state, onTurn: target }, currentPiece);
    if (validatedMoves.length > 0) {
      return false;
    }
  }

  return true;
}

export {
  getOpponentCurrentPieces,
  mutateBoard,
  findKingPosition,
  getOpponentAllPieces,
  addMoves,
  calculateMovesByDirection,
  calculateOnTurnPlayer,
  copyBoard,
  whitePieces,
  blackPieces,
  DELETE_COUNT,
  breakCastlePieces,
  isWhitePiece,
  calculateCastleMoves,
  mutateCastleAbility,
  validateMoves,
  validateCheckmate,
  calculateEnPassantTargetSquare,
};
