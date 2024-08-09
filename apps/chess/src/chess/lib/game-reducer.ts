import { ChessState, SelectedPiece } from "@/chess/lib/definitions";
import { engineMoveAction, squareClickAction, updateStateAction } from "./actions";
import { RawGameData } from "@/utils/supabase/definitions";

type ActionType =
  | { type: "SQUARE_CLICK"; payload: SelectedPiece }
  | { type: "RESET_SELECTED_SQUARE" }
  | { type: "UPDATE_PAYLOAD"; payload: RawGameData }
  | {type: "ENGINE_MOVE", payload: {fen: string, bestmove: string}}

function chessReducer(state: ChessState, action: ActionType): ChessState {
  switch (action.type) {
    case "SQUARE_CLICK":
      return squareClickAction(state, action.payload);
    case "RESET_SELECTED_SQUARE":
      return {
        ...state,
        selectedPiece: { rowIndex: null, colIndex: null, piece: null },
        possibleMoves: [],
      };
    case "UPDATE_PAYLOAD":
      return updateStateAction(state, action.payload)
    case "ENGINE_MOVE":
      return engineMoveAction(state, action.payload)
    default:
      return state;
  }
}

export { chessReducer, type ActionType };
