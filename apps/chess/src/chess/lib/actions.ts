import { ChessState, SelectedPiece } from "../context/chess-state-manager";
import {
  calculateOnTurnPlayer,
  copyBoard,
  mutateBoard,
  mutateBoardWithCastle,
  mutateCastleAbility,
  validateMoves,
} from "./helpers";
import { calculatePossibleMoves } from "./moves";

function squareClickAction(state: ChessState, payload: SelectedPiece): ChessState {
  const {
    boardState,
    possibleMoves: previousPossibleMoves,
    selectedPiece: previousSelectedPiece,
    castleAbility,
    onTurn,
  } = state;

  const { colIndex, piece, rowIndex } = payload;
  const shouldCalcMoves = piece && rowIndex !== null && colIndex !== null;
  const selectedMove = previousPossibleMoves?.find(
    (val) => val.colIndex === colIndex && val.rowIndex === rowIndex
  );

  if (
    !!selectedMove &&
    previousSelectedPiece.rowIndex !== null &&
    previousSelectedPiece.colIndex !== null &&
    !!previousSelectedPiece.piece
  ) {
    //
    // Board update logic
    //
    const newBoard = copyBoard(boardState);

    if (selectedMove.isCastle) {
      //
      // Handle castling
      //
      mutateBoardWithCastle(selectedMove, newBoard, previousSelectedPiece, onTurn);
    } else {
      //
      // Handle board change
      //
      mutateBoard(selectedMove, newBoard, previousSelectedPiece);
    }
    //
    // Determine if piece will break castle
    //
    const newCastleAbility = mutateCastleAbility(castleAbility, previousSelectedPiece, onTurn);

    return {
      ...state,
      boardState: newBoard,
      possibleMoves: [],
      selectedPiece: { rowIndex: null, colIndex: null, piece: null },
      onTurn: calculateOnTurnPlayer(onTurn),
      castleAbility: newCastleAbility,
      lastMove: {
        startColIndex: previousSelectedPiece.colIndex,
        startRowIndex: previousSelectedPiece.rowIndex,
        endColIndex: selectedMove.colIndex,
        endRowIndex: selectedMove.rowIndex,
        piece: previousSelectedPiece.piece,
      },
    };
  }

  //
  // Get all possible moves
  //
  const nextPossibleMoves = shouldCalcMoves ? calculatePossibleMoves(state, payload) : [];

  //
  // Validate all moves for check
  //
  const validatedMoves = validateMoves(nextPossibleMoves, state, payload);

  return {
    ...state,
    possibleMoves: validatedMoves,
    selectedPiece: payload,
  };
}

export { squareClickAction };
