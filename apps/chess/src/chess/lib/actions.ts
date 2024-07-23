import { ChessState, SelectedPiece } from "@/chess/lib/definitions";
import {
  calculateEnPassantTargetSquare,
  calculateOnTurnPlayer,
  copyBoard,
  mutateBoard,
  mutateCastleAbility,
  validateCheckmate,
  validateMoves,
} from "./helpers";
import { calculatePossibleMoves } from "./moves";
import { RawGameData } from "@/utils/supabase/definitions";
import { parseFen } from "./fen";

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
    //
    // Handle board change
    //
    mutateBoard(selectedMove, newBoard, previousSelectedPiece, onTurn);

    //
    // Determine if piece will break castle
    //
    const newCastleAbility = mutateCastleAbility(castleAbility, previousSelectedPiece, onTurn);
    //
    // Deterine if is enpassant possible
    //
    const enPassantTargetSquare = calculateEnPassantTargetSquare(
      selectedMove,
      previousSelectedPiece
    );
    //
    // Validate checkmate
    //
    const isCheckmate = validateCheckmate({ ...state, boardState: newBoard });

    return {
      ...state,
      boardState: newBoard,
      possibleMoves: [],
      selectedPiece: { rowIndex: null, colIndex: null, piece: null },
      onTurn: calculateOnTurnPlayer(onTurn),
      castleAbility: newCastleAbility,
      gameState: isCheckmate ? "CHECKMATE" : state.gameState,
      enPassantTargetSquare: enPassantTargetSquare || { rowIndex: null, colIndex: null },
      halfMoves: state.halfMoves + 1,
      fullMoves: state.fullMoves + 1,
      movesHistory: [...state.movesHistory, { colIndex: colIndex!, rowIndex: rowIndex! }],
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

function updateStateAction(state: ChessState, payload: RawGameData): ChessState {
  const dataFromFen = parseFen(payload.fen);
  return {
    ...state,
    ...dataFromFen,
    movesHistory: payload.movesHistory,
    users: payload.users,
    gameState: payload.gameState,
  };
}

export { squareClickAction, updateStateAction };
