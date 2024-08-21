"use client";
import React, { useState } from "react";
import {
  Board,
  GameState,
  initialBoard,
  MoveHistory,
} from "../lib/definitions";
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
import EvaluationBar from "./analyze/evaluation-bar";
import { useRouter } from "next/navigation";
import { BarChart4Icon } from "lucide-react";
import { convertFenToBoard } from "../lib/fen";

interface ReviewLayoutProps {
  history: MoveHistory[];
  fenHistory: string[];
  gameState: GameState;
  analyze: boolean;
}

export default function ReviewLayout({
  history,
  fenHistory,
  gameState,
  analyze,
}: ReviewLayoutProps) {
  const [board, setBoard] = useState<Board>(
    convertFenToBoard(fenHistory[fenHistory.length - 1]!)
  );
  const [counter, setCounter] = useState<number>(fenHistory.length - 1);
  const [lastType, setLastType] = useState<string>("");
  const shouldAnalyze = !!fenHistory?.length && analyze;

  function onclick(type: "increment" | "decrement") {
    let newCounter = counter;

    if (type === "decrement") {
      if (newCounter > 0) {
        newCounter--;
      } else {
        return;
      }
    } else if (type === "increment") {
      if (newCounter < fenHistory.length - 1) {
        newCounter++;
      } else {
        return;
      }
    }

    setLastType(type);
    setCounter(newCounter);
    setBoard(convertFenToBoard(fenHistory[newCounter]!));
  }

  function onreset(type: "first-index" | "last-index") {
    if (type === "first-index") {
      setCounter(0);
      setBoard(convertFenToBoard(fenHistory[0]!));
    } else if (type === "last-index") {
      setCounter(fenHistory.length - 1);
      setBoard(convertFenToBoard(fenHistory[fenHistory.length - 1]!));
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
          {gameState !== "" && !shouldAnalyze && (
            <Button
              onClick={() => window.location.reload()}
              variant="default"
              size="icon"
            >
              <BarChart4Icon />
            </Button>
          )}
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

                // Determine the current move based on the counter
                const currentMove = counter > 0 ? history[counter - 1] : null;

                // Highlight only the destination square
                const isTracked =
                  currentMove &&
                  rowIndex === currentMove.rowIndex &&
                  colIndex === currentMove.colIndex;

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
          {shouldAnalyze && <EvaluationBar fen={fenHistory[counter]!} />}
        </div>
      </div>
    </div>
  );
}
