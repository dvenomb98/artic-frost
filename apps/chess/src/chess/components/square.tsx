import React, { useMemo } from "react";
import { BoardValue } from "@/chess/lib/definitions";
import PieceSVG from "./piece-svg";
import { cn } from "@ui/lib/utils/cn";
import { useChessManager } from "../context/chess-state-manager";
import { isWhitePiece } from "../lib/helpers";
import { getCurrentUser } from "../lib/users";

interface SquareProps {
  piece: BoardValue;
  rowIndex: number;
  colIndex: number;
}

export default function Square({ piece, rowIndex, colIndex }: SquareProps) {
  const {
    state: { selectedPiece, possibleMoves, onTurn, gameState, users, currentUserId, movesHistory },
    isCurrentUserTurn,
    dispatch,
  } = useChessManager();

  const user = getCurrentUser(currentUserId, users)!;
  const squareColor = (rowIndex + colIndex) % 2 === 0 ? "bg-white" : "bg-muted-foreground";

  const isSelected =
    selectedPiece.piece === piece &&
    selectedPiece.colIndex === colIndex &&
    selectedPiece.rowIndex === rowIndex;

  const lastMoveObj = movesHistory[movesHistory.length - 1];
  const isLastMove = colIndex === lastMoveObj?.colIndex && rowIndex === lastMoveObj?.rowIndex;

  const isPossibleMove = possibleMoves.some(
    (val) => val.colIndex === colIndex && val.rowIndex === rowIndex
  );

  const unclickable = !isCurrentUserTurn || gameState === "CHECKMATE" || gameState === "DRAW" || gameState === "SURRENDER";

  const disabled = useMemo(() => {
    if (unclickable) return true;
    if (!possibleMoves.length) {
      return onTurn === "WHITE" ? !isWhitePiece(piece) : isWhitePiece(piece);
    } else {
      return !isPossibleMove;
      // return !isPossibleMove ? isWhitePiece(piece) ? user.role !== "WHITE" : user.role !== "BLACK" : !isPossibleMove
    }
  }, [possibleMoves, isPossibleMove, isCurrentUserTurn, user]);

  function onClick() {
    if (disabled) {
      dispatch({ type: "RESET_SELECTED_SQUARE" });
      return;
    }
    dispatch({
      type: "SQUARE_CLICK",
      payload: {
        rowIndex,
        colIndex,
        piece,
      },
    });
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
        "transform rotate-180": user.role === "BLACK",
        
      })}
    >
      <PieceSVG piece={piece} />
    </button>
  );
}
