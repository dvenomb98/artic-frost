"use client";
import React, { useEffect, useState } from "react";

import useStockfish from "@/services/stockfish/use-stockfish";
import { cn } from "@ui/lib/utils/cn";


const barClasses =
  "absolute w-full flex items-center justify-center text-xs sm:text-[8px] font-bold transform duration-300";

export default function EvaluationBar({ fen }: { fen: string }) {
  const { getEvaluation } = useStockfish(true, "ANALYZE");
  const [evaluation, setEvaluation] = useState<number>(0);

  useEffect(() => {
    async function getEval() {
      // Get evalution from engine
      const data = await getEvaluation(fen);
      // Convert it to UI 
      const currentPlayer = fen.split(" ")[1];
      const adjustedEvaluation =
        currentPlayer === "b" ? -data.evaluation : data.evaluation;
      // Set 
      setEvaluation(adjustedEvaluation);
    }
    getEval();
  }, [fen]);

  const normalizedEval = Math.max(-1, Math.min(1, evaluation / 1000));
  const positive = normalizedEval > 0;
  const whiteHeight = positive
    ? `${50 + normalizedEval * 50}%`
    : `${50 + normalizedEval * 50}%`;
  const blackHeight = !positive
    ? `${50 - normalizedEval * 50}%`
    : `${50 - normalizedEval * 50}%`;

  return (
    <div className="flex flex-col items-center justify-center w-10 sm:w-8 min-h-full border rounded relative">
      {/* White (Lower) Section */}
      <div
        className={cn(
          barClasses,
          "bg-white bottom-0",
          positive ? "text-black" : "text-transparent"
        )}
        style={{
          height: whiteHeight,
        }}
      >
        {positive && (
          <span className="absolute top-1/2 transform -translate-y-1/2">
            {normalizedEval.toFixed(2)}
          </span>
        )}
      </div>

      {/* Black (Upper) Section */}
      <div
        className={cn(
          barClasses,
          "bg-black top-0",
          !positive ? "text-white" : "text-transparent"
        )}
        style={{
          height: blackHeight,
        }}
      >
        {!positive && (
          <span className="absolute top-1/2 transform -translate-y-1/2">
            {Math.abs(+normalizedEval.toFixed(2))}
          </span>
        )}
      </div>
    </div>
  );
}
