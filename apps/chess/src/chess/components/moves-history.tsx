"use client";
import React from "react";
import { useChessManager } from "../context/chess-state-manager";
import { convertColToString } from "../lib/fen";
import PieceSVG from "./piece-svg";
import { MoveHistory } from "../lib/definitions";
import { cn } from "@ui/lib/utils/cn";
import { isWhitePiece } from "../lib/helpers";
import {ScrollArea} from "@ui/components/ui/scroll-area"

export default function MovesHistory() {
  const {
    state: { movesHistory },
  } = useChessManager();

  const grid: MoveHistory[][] = [];
  for (let i = 0; i < movesHistory.length; i += 2) {
    grid.push(movesHistory.slice(i, i + 2));
  }

  return (
    <div className="flex flex-col space-y-3 text-sm">
      <h4 className="font-medium">Moves history</h4>
      {!movesHistory.length && <p className="text-muted-foreground">Empty</p>}
      <ScrollArea className="flex flex-col gap-1">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-[0.5fr_2fr_2fr]">
            <p className="basis-1/5">{rowIndex + 1}.</p>
            {row.map((move, moveIndex) => (
              <div
                key={moveIndex}
                className={cn(
                  "flex items-center basis-4/5",
                  !isWhitePiece(move.piece) && "bg-muted rounded"
                )}
              >
                <PieceSVG className="w-5 h-5" piece={move.piece} />
                <span>{convertColToString(move.colIndex)}</span>
                <span>{move.rowIndex} </span>
              </div>
            ))}
          </div>
        ))}
         </ScrollArea>
      </div>
  );
}
