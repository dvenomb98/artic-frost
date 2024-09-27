import { FenState, GameResult, Move, Square } from "chess-lite/definitions";
import { calculatePossibleMoves } from "chess-lite/lib/moves";
import {
  getNextPlayer,
  getSquarePiece,
  mutateBoard,
  validateMoves,
} from "chess-lite/lib/board";
import {
  getNextCastleAbility,
  getEnPassantTargetSquare,
  getNextHalfMoves,
  getGameState,
} from "chess-lite/lib/state";

/**
 * Get the validated moves for a given square
 * @param state - The current state of the game
 * @param square - The square to get the moves for
 * @returns The validated moves
 */
function getValidatedMoves(state: FenState, square: Square): Move[] {
  const { colIndex, rowIndex, piece } = square;
  const shouldCalcMoves = piece && rowIndex !== null && colIndex !== null;

  /*
    If the square is not valid, return an empty array
  */
  if (!shouldCalcMoves) {
    return [];
  }

  const nextPossibleMoves = calculatePossibleMoves(state, square);
  const validatedMoves = validateMoves(nextPossibleMoves, state, square);

  return validatedMoves;
}

/**
 * Move a piece on the board
 *
 * IMPORTANT: This does not validate the move, it just moves the piece on the board and return the new state
 *
 * @param state - The current state of the game
 * @param move - The move to make
 * @returns The new state of the game
 */
function move(state: FenState, move: Move): FenState {
  const nextBoard = mutateBoard(move, state.board);
  const targetPiece = getSquarePiece(move.colIndex, move.rowIndex, state.board);

  const nextCastleAbility = getNextCastleAbility(move, state);
  const nextEnPassantTargetSquare = getEnPassantTargetSquare(move);
  const nextHalfMoves = getNextHalfMoves(
    move.piece,
    targetPiece!,
    state.halfMoves
  );

  return {
    board: nextBoard,
    castleAbility: nextCastleAbility,
    enPassantTargetSquare: nextEnPassantTargetSquare,
    halfMoves: nextHalfMoves,
    fullMoves: state.onTurn === "BLACK" ? state.fullMoves + 1 : state.fullMoves,
    onTurn: getNextPlayer(state.onTurn),
  };
}

/**
 * Get the game result
 * @param state - The current state of the game
 * @returns The game result
 */

function getGameResult(state: FenState): GameResult {
  const { onTurn } = state;
  const gameState = getGameState(state);
  const winner =
    gameState === "CHECKMATE" ? (onTurn === "WHITE" ? "BLACK" : "WHITE") : null;

  return {
    winner,
    gameState,
  };
}

export { getValidatedMoves, move, getGameResult };
