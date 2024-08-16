"use client";
import React, { useState } from "react";
import { Board, initialBoard, MoveHistory } from "../lib/definitions";
import PieceSVG from "./piece-svg";
import { createBoardFromHistory } from "../lib/helpers";
import { cn } from "@ui/lib/utils/cn";
import {
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@ui/components/ui/button";
import EvaluationBar from "./analyze/evaluation-board";

interface ReviewLayoutProps {
  history: MoveHistory[];
  fenHistory?: string[];
}

export default function ReviewLayout({
  history,
  fenHistory,
}: ReviewLayoutProps) {
  const [board, setBoard] = useState<Board>(createBoardFromHistory(history));
  const [counter, setCounter] = useState<number>(history.length - 1);
  const [lastType, setLastType] = useState<string>("");
  const shouldAnalyze = !!fenHistory?.length;

  function onclick(type: "increment" | "decrement") {
    let newCounter = counter;

    if (type === "decrement") {
      if (newCounter + 1 > 0) {
        newCounter--;
      } else {
        return;
      }
    } else if (type === "increment") {
      if (newCounter < history.length - 1) {
        newCounter++;
      } else {
        return;
      }
    }
    setLastType(type);
    setBoard(createBoardFromHistory(history.slice(0, newCounter + 1)));
    setCounter(newCounter);
  }

  function onreset(type: "first-index" | "last-index") {
    if (type === "first-index") {
      setCounter(-1);
      setBoard(initialBoard);
    }
    if (type === "last-index") {
      setCounter(history.length - 1);
      setBoard(createBoardFromHistory(history));
    }
    setLastType("");
  }

  const buttons = [
    {
      fn: () => onreset("first-index"),
      icon: ChevronsLeft,
    },
    {
      fn: () => onclick("decrement"),
      icon: ChevronLeft,
    },
    {
      fn: () => onclick("increment"),
      icon: ChevronRight,
    },
    {
      fn: () => onreset("last-index"),
      icon: ChevronsRight,
    },
  ];

  return (
      <div className="w-auto h-auto">
        <div className="space-y-4 max-w-[500px] mx-auto">
          <div className="space-x-4 flex justify-center">
            {buttons.map((btn, i) => (
              <Button key={i} variant="outline" size="icon" onClick={btn.fn}>
                <btn.icon />
              </Button>
            ))}
          </div>
          <div className="flex h-full gap-2">
          <section className="grid grid-cols-8 grid-rows-8 w-full">
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const squareColor =
                  (rowIndex + colIndex) % 2 === 0
                    ? "bg-white"
                    : "bg-muted-foreground";

                const trackedIndex = lastType === "decrement" ? 1 : 0;
                const trackedMove = history[counter + trackedIndex];
                const isTracked =
                  (lastType === "decrement"
                    ? rowIndex === trackedMove?.prevRowIndex &&
                      colIndex === trackedMove?.prevColIndex
                    : rowIndex === trackedMove?.rowIndex &&
                      colIndex === trackedMove?.colIndex) && lastType;
                return (
                  <div
                    className={cn(squareColor, {
                      "border-2 border-rose-600": isTracked,
                    })}
                    key={`${rowIndex}-${colIndex}`}
                  >
                    <PieceSVG piece={piece} />
                  </div>
                );
              })
            )}
          </section>
          {shouldAnalyze && <EvaluationBar fen={fenHistory[counter + 1]!} />}
          </div>
        </div>
      </div>
  );
}
