import {EngineDifficultyKeys} from "@/services/models";
import {EngineConfigValues} from "@/services/stockfish/config";

import {StockfishEvaluation} from "./types";
import {createStockfishWorker} from "@/services/stockfish/utils";
import {useCallback, useEffect, useRef} from "react";
import {toast} from "sonner";
import {getConfig} from "./utils";
import {logDevOnly} from "@/lib/log";

function useStockfish(
  shouldInit: boolean = false,
  diff: EngineDifficultyKeys | null
) {
  const stockfishRef = useRef<Worker | null>(null);

  const configRef = useRef<EngineConfigValues>(null);

  const sendCommand = useCallback((command: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!stockfishRef.current) {
        reject(new Error("Stockfish is not initialized"));
        return;
      }

      function handler(event: MessageEvent) {
        const message = event.data;
        if (message.includes("uciok") || message.includes("readyok")) {
          stockfishRef.current?.removeEventListener("message", handler);
          resolve(message);
        }
      }

      stockfishRef.current.addEventListener("message", handler);
      stockfishRef.current.postMessage(command);
    });
  }, []);

  useEffect(() => {
    if (!shouldInit) return;

    async function initStockfish() {
      try {
        configRef.current = diff ? getConfig(diff) : null;
        stockfishRef.current = createStockfishWorker();
        await sendCommand("uci");

        // Configure engine with initial settings
        if (configRef.current) {
          await sendCommand(
            `setoption name Skill Level value ${configRef.current.SKILL_LEVEL}`
          );
          await sendCommand(
            `setoption name Contempt value ${configRef.current.CONTEMPT}`
          );
          await sendCommand(
            `setoption name Hash value ${configRef.current.HASH_SIZE}`
          );
          await sendCommand(
            `setoption name Threads value ${configRef.current.THREADS}`
          );
          await sendCommand(
            `setoption name Move Overhead value ${configRef.current.MOVE_OVERHEAD}`
          );
        }

        await sendCommand("isready");
      } catch (_) {
        toast.error(
          "Error initializing Stockfish. Please refresh the page and try again."
        );
      }
    }

    initStockfish();

    return () => {
      if (stockfishRef.current) {
        stockfishRef.current.terminate();
        stockfishRef.current = null;
      }
    };
  }, [shouldInit, diff, sendCommand]);

  const analyzePosition = useCallback(
    async (fen: string): Promise<StockfishEvaluation> => {
      if (!stockfishRef.current) {
        throw new Error("Stockfish is not initialized");
      }

      return new Promise((resolve, reject) => {
        let evaluation = 0;
        let depth = 0;
        let bestMove: string | undefined;

        const handler = (event: MessageEvent) => {
          const message = event.data;

          if (message.startsWith("info depth")) {
            const scoreMatch = message.match(/score (cp|mate) (-?\d+)/);
            const depthMatch = message.match(/depth (\d+)/);

            if (scoreMatch) {
              if (scoreMatch[1] === "cp") {
                evaluation = parseInt(scoreMatch[2], 10) / 100;
              } else if (scoreMatch[1] === "mate") {
                const mateIn = parseInt(scoreMatch[2], 10);
                evaluation = mateIn > 0 ? Infinity : -Infinity;
              }
            }
            if (depthMatch) {
              depth = parseInt(depthMatch[1], 10);
            }
          }

          if (message.startsWith("bestmove")) {
            bestMove = message.split(" ")[1];
            stockfishRef.current?.removeEventListener("message", handler);

            // After getting bestMove, make the move and get the new FEN
            stockfishRef.current?.postMessage(
              `position fen ${fen} moves ${bestMove}`
            );
            stockfishRef.current?.postMessage("d"); // 'd' command outputs the current position

            // Add new handler for getting the FEN
            const fenHandler = (fenEvent: MessageEvent) => {
              const fenMessage = fenEvent.data;
              if (fenMessage.includes("Fen:")) {
                const newFen = fenMessage.split("Fen: ")[1].trim();
                stockfishRef.current?.removeEventListener(
                  "message",
                  fenHandler
                );

                logDevOnly({
                  originalFen: fen,
                  evaluation,
                  depth,
                  bestMove: bestMove || "Not found",
                  areFensEqual: fen === newFen,
                  newFen,
                  analysisInfo: {
                    scoreType: evaluation === Infinity ? "mate" : "cp",
                    moveOverhead: configRef.current?.MOVE_OVERHEAD,
                    skillLevel: configRef.current?.SKILL_LEVEL,
                    maxDepth: configRef.current?.MAX_DEPTH,
                  },
                });

                resolve({
                  evaluation,
                  depth,
                  bestMove: bestMove!,
                  updatedFen: newFen,
                });
              }
            };

            stockfishRef.current?.addEventListener("message", fenHandler);
          }
        };

        try {
          if (!configRef.current) {
            throw new Error("Config is not initialized");
          }

          stockfishRef.current!.addEventListener("message", handler);
          stockfishRef.current!.postMessage(`position fen ${fen}`);
          stockfishRef.current!.postMessage(
            `setoption name MultiPV value ${configRef.current.NUMBER_OF_LINES}`
          );
          // Add time control based on move overhead
          stockfishRef.current!.postMessage(
            `go depth ${configRef.current.MAX_DEPTH} movetime ${configRef.current.MOVE_OVERHEAD * 10}`
          );
        } catch (error) {
          toast.error(
            "Error analyzing position. Please refresh the page and try again."
          );
          reject(error);
        }
      });
    },
    []
  );

  const setEngineConfig = async (difficulty: EngineDifficultyKeys) => {
    configRef.current = getConfig(difficulty);

    // Update engine settings when config changes
    if (stockfishRef.current && configRef.current) {
      try {
        await sendCommand(
          `setoption name Skill Level value ${configRef.current.SKILL_LEVEL}`
        );
        await sendCommand(
          `setoption name Contempt value ${configRef.current.CONTEMPT}`
        );
        await sendCommand(
          `setoption name Hash value ${configRef.current.HASH_SIZE}`
        );
        await sendCommand(
          `setoption name Threads value ${configRef.current.THREADS}`
        );
        await sendCommand(
          `setoption name Move Overhead value ${configRef.current.MOVE_OVERHEAD}`
        );
        await sendCommand("isready");
      } catch (_) {
        toast.error("Error updating engine settings");
      }
    }
  };

  return {
    analyzePosition,
    setEngineConfig,
    isReady: !!stockfishRef.current,
  };
}

export {useStockfish, getConfig};
