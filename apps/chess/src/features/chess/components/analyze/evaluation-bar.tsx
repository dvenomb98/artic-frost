/* eslint-disable */
"use client";
import {useStockfish} from "@/services/stockfish/use-stockfish";

function EvaluationBar({fen}: {fen: string}) {
  const {analyzePosition} = useStockfish(true, "ANALYZE");
  return null; // TODO
}

export {EvaluationBar};
