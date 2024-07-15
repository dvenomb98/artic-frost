import React, { useMemo } from "react";
import { BoardValue } from "@/chess/lib/definitions"
import PieceSVG from "./piece-svg";
import { cn } from "@ui/lib/utils/cn";
import { useChessManager } from "../context/chess-state-manager";
import { isWhitePiece } from "../lib/helpers";

interface SquareProps {
  piece: BoardValue;
  rowIndex: number;
  colIndex: number;
}

export default function Square({ piece, rowIndex, colIndex }: SquareProps) {
  const {
    state: { selectedPiece, possibleMoves, onTurn },
    dispatch,
  } = useChessManager();

  const squareColor = (rowIndex + colIndex) % 2 === 0 ? "bg-white" : "bg-zinc-500";

  const isSelected =
    selectedPiece.piece === piece &&
    selectedPiece.colIndex === colIndex &&
    selectedPiece.rowIndex === rowIndex;

  const isPossibleMove = possibleMoves.some(
    (val) => val.colIndex === colIndex && val.rowIndex === rowIndex
  );

  const disabled = useMemo(() => {
    if (!possibleMoves.length) {
      return onTurn === "WHITE" ? !isWhitePiece(piece) : isWhitePiece(piece);
    } else {
      return !isPossibleMove;
    }
  }, [possibleMoves, isPossibleMove]);

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
      key={`${rowIndex}-${colIndex}`}
      className={cn(squareColor, {
        "border-red-500 border-2": isSelected,
        "border-green-500 border-2": isPossibleMove,
        "cursor-default": disabled
      })}
    >
      <PieceSVG piece={piece} />
    </button>
  );
}
