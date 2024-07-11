import { ChessState, SelectedPiece } from "@/chess/context/chess-state-manager";
import { squareClickAction } from "./actions";

type ActionType = { type: "SQUARE_CLICK"; payload: SelectedPiece };

function chessReducer(state: ChessState, action: ActionType): ChessState {
  switch (action.type) {
    case "SQUARE_CLICK":
      return squareClickAction(state, action.payload);
    default:
      return state;
  }
}

export { chessReducer, type ActionType };


