import { parseFen } from "chess-lite/fen";
import { getSquarePiece } from "chess-lite/lib/board";
import { getGameResult, getValidatedMoves, move } from "chess-lite/api";

import { RawGameData } from "@/services/supabase/definitions";
import { parseEngineMove } from "@/services/stockfish/helpers";

import { SquareClickPayload } from "./game-reducer";
import { ChessState } from "./definitions";
import { isCastleMove, parseMoveHistory } from "./helpers";

function squareClickAction(
  state: ChessState,
  payload: SquareClickPayload
): ChessState {
  const { possibleMoves, selectedPiece } = state;
  const { colIndex, rowIndex } = payload || {};

  if (!payload) return state;

  const selectedMove = possibleMoves?.find(
    val => val.colIndex === colIndex && val.rowIndex === rowIndex
  );

  if (!!selectedMove && !!selectedPiece) {
    const nextFenState = move(state, selectedMove);
    const nextGameResult = getGameResult(nextFenState);

    return {
      ...state,
      ...nextFenState,
      ...nextGameResult,
      possibleMoves: [],
      selectedPiece: null,
      winnerId:
        nextGameResult.gameState === "CHECKMATE" ? state.currentUserId : null,
      movesHistory: [
        ...state.movesHistory,
        {
          ...selectedMove,
        },
      ],
    };
  }

  // If no move is selected, return the state with the selected piece
  const nextPossibleMoves = getValidatedMoves(state, payload);
  return {
    ...state,
    possibleMoves: nextPossibleMoves,
    selectedPiece: payload,
  };
}

function engineMoveAction(
  state: ChessState,
  payload: { fen: string; bestmove: string }
): ChessState {

  const data = parseFen(payload.fen);
  const engineMove = parseEngineMove(payload.bestmove);

  const piece = getSquarePiece(
    engineMove.prevColIndex,
    engineMove.prevRowIndex,
    state.board
  )!;

  const nextGameResult = getGameResult(data);

  return {
    ...state,
    ...data,
    ...nextGameResult,
    possibleMoves: [],
    selectedPiece: null,
    winnerId: nextGameResult.gameState === "CHECKMATE" ? "engine" : null,
    movesHistory: [
      ...state.movesHistory,
      {
        ...engineMove,
        piece: piece,
        isEnPassant: !!data.enPassantTargetSquare,
        isCastle: isCastleMove({ ...engineMove, piece }),
      },
    ],
  };
}

function updateStateAction(
  state: ChessState,
  payload: RawGameData
): ChessState {
  const dataFromFen = parseFen(payload.fen);
  const movesHistory = parseMoveHistory(payload.movesHistory);

  return {
    ...state,
    ...dataFromFen,
    movesHistory,
    users: payload.users,
    gameState: payload.gameState,
    chat: payload.chat,
    winnerId: payload.winnerId,
  };
}

export { squareClickAction, updateStateAction, engineMoveAction };
