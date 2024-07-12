import React from "react";
import { BoardValue } from "../lib/board";
import PieceSVG from "./piece-svg";
import { cn } from "@ui/lib/utils/cn";
import { useChessManager } from "../context/chess-state-manager";

interface SquareProps {
  piece: BoardValue;
  rowIndex: number;
  colIndex: number;
}

export default function Square({ piece, rowIndex, colIndex }: SquareProps) {
  const {
    state: { selectedPiece, possibleMoves },
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

 
  function onClick() {
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
      })}
    >
      <PieceSVG piece={piece} />
    </button>
  );
}
