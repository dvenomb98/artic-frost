import { ChessState, SelectedPiece } from "../context/chess-state-manager";
import { calculatePossibleMoves } from "./moves";

function squareClickAction(state: ChessState, payload: SelectedPiece): ChessState {
  const {
    boardState,
    possibleMoves: previousPossibleMoves,
    selectedPiece: previousSelectedPiece,
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
    // Piece movement logic
    //

    const DELETE_COUNT = 1;
    const newBoard = [...boardState];
    newBoard[previousSelectedPiece.rowIndex]?.splice(
      previousSelectedPiece.colIndex,
      DELETE_COUNT,
      null
    );
    newBoard[selectedMove.rowIndex]?.splice(
      selectedMove.colIndex,
      DELETE_COUNT,
      previousSelectedPiece.piece
    );

    return {
      ...state,
      boardState: newBoard,
      possibleMoves: [],
      selectedPiece: { rowIndex: null, colIndex: null, piece: null },
    };
  }

  const nextPossibleMoves =
    shouldCalcMoves && !selectedMove ? calculatePossibleMoves(state, payload) : [];

  return {
    ...state,
    possibleMoves: nextPossibleMoves,
    selectedPiece: payload,
  };
}

export { squareClickAction };
