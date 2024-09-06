"use client";
import React from "react";
import { useChessManager } from "../context/chess-state-manager";
import { convertColToString } from "../lib/fen";
import PieceSVG from "./piece-svg";
import { MoveHistory } from "../lib/definitions";

export default function MovesHistory() {
  const {
    state: { movesHistory },
  } = useChessManager();

  const grid: MoveHistory[][] = [];
  for (let i = 0; i < movesHistory.length; i += 2) {
    grid.push(movesHistory.slice(i, i + 2));
  }

  return (
    <div className="space-y-2 text-sm w-full overflow-x-hidden">
      <h4>Moves history</h4>
      {!movesHistory.length && <p className="text-muted-foreground">Empty</p>}
      <div className="overflow-x-scroll hide-scrollbar lg:w-[300px] sm:w-full">
        <div className="flex">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-1 mr-6">
              <p>{rowIndex + 1}.</p>
              {row.map((move, moveIndex) => (
                <div key={moveIndex} className="flex items-center gap-2">
                  <div className="bg-foreground/50 rounded">
                    <PieceSVG className="w-8 h-8" piece={move.piece} />
                  </div>
                  <span className="block">
                    {convertColToString(move.colIndex)}
                    {move.rowIndex}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
