import { StockfishEvaluation } from "../../../services/stockfish/types";
import {
  engineMoveAction,
  squareClickAction,
  updateStateAction,
} from "./actions";

import { Square, ChessState } from "./definitions";

type SquareClickPayload = Square | null

type ActionType =
  | { type: "SQUARE_CLICK"; payload: SquareClickPayload }
  | { type: "RESET_SELECTED_SQUARE" }
  | { type: "UPDATE_PAYLOAD"; payload: unknown }
  | { type: "UPDATE_STATE"; payload: ChessState }
  | { type: "ENGINE_MOVE"; payload: StockfishEvaluation };

function chessReducer(state: ChessState, action: ActionType): ChessState {
  switch (action.type) {
    case "SQUARE_CLICK":
      return squareClickAction(state, action.payload);
    case "RESET_SELECTED_SQUARE":
      return {
        ...state,
        selectedPiece: null,
        possibleMoves: [],
      };
    case "UPDATE_PAYLOAD":
      return updateStateAction(state, action.payload);
    case "UPDATE_STATE":
      return action.payload;
    case "ENGINE_MOVE":
      return engineMoveAction(state, action.payload);
    default:
      return state;
  }
}

export { chessReducer, type ActionType, type SquareClickPayload };
