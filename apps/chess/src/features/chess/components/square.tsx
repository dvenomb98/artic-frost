import React, { useMemo } from "react";
import { toast } from "sonner";
import { isWhitePiece } from "chess-lite/lib/board";

import { cn } from "@artic-frost/ui/lib";

import { BoardValue } from "../store/definitions";
import { useChessManager } from "../context/chess-state-manager";
import { chessReducer } from "../store/game-reducer";
import { sendGameDataToSupabase } from "../api/actions";

import PieceSVG from "./piece-svg";
import { getUserRole } from "../store/utils";

interface SquareProps {
  piece: BoardValue;
  rowIndex: number;
  colIndex: number;
}

export default function Square({ piece, rowIndex, colIndex }: SquareProps) {
  const { state, isCurrentUserTurn, dispatch, setLoading, loading } =
    useChessManager();

  const {
    selectedPiece,
    possibleMoves,
    onTurn,
    gameState,
    currentUserId,
    userWhiteId,
    movesHistory,
  } = state;

  const role = getUserRole(currentUserId, userWhiteId);

  const squareColor =
    (rowIndex + colIndex) % 2 === 0 ? "bg-white" : "bg-muted-foreground";

  const isSelected =
    selectedPiece?.piece === piece &&
    selectedPiece?.colIndex === colIndex &&
    selectedPiece?.rowIndex === rowIndex;

  const lastMoveObj = movesHistory[movesHistory.length - 1];
  const isLastMove =
    colIndex === lastMoveObj?.colIndex && rowIndex === lastMoveObj?.rowIndex;

  const isPossibleMove = possibleMoves.some(
    val => val.colIndex === colIndex && val.rowIndex === rowIndex
  );

  const unclickable =
    loading ||
    !isCurrentUserTurn ||
    gameState === "CHECKMATE" ||
    gameState === "DRAW" ||
    gameState === "SURRENDER";

  const disabled = useMemo(() => {
    if (unclickable) return true;
    if (!possibleMoves.length) {
      return onTurn === "WHITE" ? !isWhitePiece(piece) : isWhitePiece(piece);
    } else {
      return !isPossibleMove;
    }
  }, [possibleMoves, isPossibleMove, isCurrentUserTurn]);

  async function onClick() {
    if (disabled) {
      dispatch({ type: "RESET_SELECTED_SQUARE" });
      return;
    }

    const nextState = chessReducer(state, {
      type: "SQUARE_CLICK",
      payload: {
        rowIndex,
        colIndex,
        piece,
      },
    });

    dispatch({ type: "UPDATE_STATE", payload: nextState });

    try {
      if (nextState.onTurn !== state.onTurn) {
        setLoading(true);
        await sendGameDataToSupabase(nextState);
      }
    } catch (e) {
      dispatch({ type: "UPDATE_STATE", payload: state });
      toast.error(
        "Sorry, it seems like there was an error related to your move. Try it again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={unclickable}
      key={`${rowIndex}-${colIndex}`}
      className={cn(squareColor, {
        "border-amber-500 border-2": isLastMove,
        "border-rose-600 border-2": isSelected,
        "border-green-500 border-2": isPossibleMove,
        "cursor-default": disabled,
        "transform rotate-180": role === "BLACK",
      })}
    >
      <PieceSVG piece={piece} />
    </button>
  );
}
