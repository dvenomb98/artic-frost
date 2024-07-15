import { ChessState, SelectedPiece } from "@/chess/lib/definitions"
import { squareClickAction } from "./actions";

type ActionType =
  | { type: "SQUARE_CLICK"; payload: SelectedPiece }
  | { type: "RESET_SELECTED_SQUARE" };

function chessReducer(state: ChessState, action: ActionType): ChessState {
  switch (action.type) {
    case "SQUARE_CLICK":
      return squareClickAction(state, action.payload);
    case "RESET_SELECTED_SQUARE":
      return { ...state, selectedPiece: { rowIndex: null, colIndex: null, piece: null }, possibleMoves: [] };

    default:
      return state;
  }
}

export { chessReducer, type ActionType };
