"use client";
import React, { useEffect, useRef } from "react";
import { useChessManager } from "../context/chess-state-manager";
import { convertColToString } from "../lib/fen";
import PieceSVG from "./piece-svg";
import { MoveHistory } from "../lib/definitions";


export default function MovesHistory() {
  const {
    state: { movesHistory },
  } = useChessManager();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
  }, [movesHistory.length]);

  const grid: MoveHistory[][] = [];
  for (let i = 0; i < movesHistory.length; i += 2) {
    grid.push(movesHistory.slice(i, i + 2));
  }

  return (
    <div className="space-y-2 text-sm w-full overflow-x-hidden">
    <h4 className="font-medium">Moves history</h4>
    {!movesHistory.length && <p className="text-muted-foreground">Empty</p>}
    <div 
      ref={scrollRef}
      className="overflow-x-scroll hide-scrollbar lg:w-[300px] sm:w-full"
    >
      <div className="flex py-2">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center mr-4">
            <span className="text-muted-foreground mr-2">{rowIndex + 1}.</span>
            <div className="flex flex-col gap-2">
              {row.map((move, moveIndex) => (
                <div key={moveIndex} className="flex items-center gap-2 bg-secondary/30 rounded-md p-1">
                  <div className="bg-foreground/50 rounded-sm">
                    <PieceSVG className="w-6 h-6" piece={move.piece} />
                  </div>
                  <span className="font-medium">
                    {convertColToString(move.colIndex)}
                    {move.rowIndex}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}
