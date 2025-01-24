import { generateFen, parseFen } from "chess-lite/fen";
import { getSquarePiece } from "chess-lite/lib/board";
import { getGameResult, getValidatedMoves, move } from "chess-lite/api";

import { parseEngineMove } from "@/services/stockfish/helpers";

import { SquareClickPayload } from "./game-reducer";
import { ChessState } from "./definitions";
import { getStatus, isCastleMove } from "./helpers";
import { convertRawToState } from "../api/utils";


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
    const nextStatus = getStatus(nextGameResult.gameState, state.status);

    return {
      ...state,
      ...nextFenState,
      ...nextGameResult,
      possibleMoves: [],
      selectedPiece: null,
      winnerId:
        nextGameResult.gameState === "CHECKMATE" ? state.currentUserId : null,
      status: nextStatus,
      movesHistory: [
        ...state.movesHistory,
        {
          ...selectedMove,
        },
      ],
      history: [...state.history, generateFen(nextFenState)],
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
  const nextStatus = getStatus(nextGameResult.gameState, state.status);

  return {
    ...state,
    ...data,
    ...nextGameResult,
    status: nextStatus,
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
    history: [...state.history, payload.fen],
  };
}

function updateStateAction(
  state: ChessState,
  payload: unknown
): ChessState {

  const newState = convertRawToState(payload);

  return {
    ...state,
    ...newState
  };
}

export { squareClickAction, updateStateAction, engineMoveAction };
