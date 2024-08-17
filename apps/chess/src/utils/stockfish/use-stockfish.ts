import { useCallback, useEffect, useRef, useState } from "react";
import { ENGINE_CONFIG, EngineConfigValues } from "./config";

/**
 * Hook for interacting with the Stockfish chess engine.
 *
 * @param {boolean} shouldInit - Initialize only if true.
 * @param {"PLAY" | "ANALYZE"} type - Determines the purpose of the engine: "PLAY" for gameplay, "ANALYZE" for analysis.
 * @param {"EASY" | "MEDIUM" | "HARD"} [difficulty="EASY"] - Difficulty level when playing against the engine.
 *
 * @returns {object} - Contains methods for getting the best move and evaluation.
 */

function useStockfish(shouldInit: boolean = false, type: "PLAY" | "ANALYZE") {
  const stockfishRef = useRef<Worker | null>(null);
  const initConfig =
    type === "PLAY" ? ENGINE_CONFIG.PLAY.MEDIUM : ENGINE_CONFIG.ANALYZE;
  const [engineConfig, setEngineConfig] =
    useState<EngineConfigValues>(initConfig);

  useEffect(() => {
    if (!shouldInit) return;

    if (!stockfishRef.current) {
      stockfishRef.current = new Worker("/stockfish.js");
    }

    return () => {
      if (stockfishRef.current) {
        stockfishRef.current.terminate();
        stockfishRef.current = null;
      }
    };
  }, [shouldInit]);

  const getEngineFen = useCallback(
    (fen: string): Promise<{ fen: string; bestmove: string }> => {
      return new Promise((resolve, reject) => {
        if (!stockfishRef.current) {
          return reject("Stockfish is not initialized");
        }

        let bestMove = "";

        stockfishRef.current.onmessage = event => {
          const message = event.data;

          if (message.includes("Fen:")) {
            const fullFen = message.split("Fen: ")[1];
            resolve({ fen: fullFen, bestmove: bestMove });
          }

          if (message.startsWith("bestmove")) {
            bestMove = message.split(" ")[1];
            stockfishRef.current?.postMessage(
              `position fen ${fen} moves ${bestMove}`
            );
            stockfishRef.current?.postMessage("d");
          }
        };

        stockfishRef.current.postMessage("uci");
        stockfishRef.current.postMessage(`position fen ${fen}`);
        stockfishRef.current.postMessage(
          `go depth ${engineConfig.MAX_DEPTH} movetime ${engineConfig.MOVE_TIME}`
        );
      });
    },
    [engineConfig]
  );

  const getEvaluation = useCallback(
    (fen: string): Promise<{ evaluation: number }> => {
      return new Promise((resolve, reject) => {
        if (!stockfishRef.current) {
          return reject("Stockfish is not initialized");
        }

        let evaluation = 0;

        stockfishRef.current.onmessage = event => {
          const message = event.data;

          if (message.startsWith("info depth")) {
            const scoreMatch = message.match(/score (cp|mate) (-?\d+)/);
            if (scoreMatch) {
              if (scoreMatch[1] === "cp") {
                evaluation = parseInt(scoreMatch[2], 10);
              } else if (scoreMatch[1] === "mate") {
                evaluation =
                  scoreMatch[2] > 0
                    ? 10000 - parseInt(scoreMatch[2], 10)
                    : -10000 + parseInt(scoreMatch[2], 10);

                resolve({ evaluation });
              }
            }
          }

          if (message.startsWith("bestmove")) {
            resolve({ evaluation });
          }
        };

        stockfishRef.current.postMessage("uci");
        stockfishRef.current.postMessage(`position fen ${fen}`);
        stockfishRef.current.postMessage(
          `go depth ${engineConfig.MAX_DEPTH} movetime ${engineConfig.MOVE_TIME}`
        );
      });
    },
    [engineConfig]
  );

  return { getEngineFen, getEvaluation, setEngineConfig };
}

export default useStockfish;
