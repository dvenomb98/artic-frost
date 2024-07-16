import { ChessState, SelectedPiece } from "@/chess/lib/definitions";
import { squareClickAction } from "./actions";
import { RawGameData } from "@/utils/supabase/definitions";
import { parseFen } from "./fen";

type ActionType =
  | { type: "SQUARE_CLICK"; payload: SelectedPiece }
  | { type: "RESET_SELECTED_SQUARE" }
  | { type: "UPDATE_PAYLOAD"; payload: RawGameData };

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
      const dataFromFen = parseFen(action.payload.fen);
      return {
        ...state,
        ...dataFromFen,
        gameState: action.payload.gameState,
      };

    default:
      return state;
  }
}

export { chessReducer, type ActionType };
