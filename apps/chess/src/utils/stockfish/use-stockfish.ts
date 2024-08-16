import { useCallback, useEffect, useRef, useState } from "react";
import { ENGINE_CONFIG } from "./config";


/**
 * Description of the universal chess interface (UCI)
 * https://gist.github.com/aliostad/f4470274f39d29b788c1b09519e67372
 *
 * @param {string} shouldInit - init only when gametype === "engine"
 *
 */
function useStockfish(shouldInit: boolean = false) {
  const stockfishRef = useRef<Worker | null>(null);
  const [engineDepth, setEngineDepth] = useState<number>(ENGINE_CONFIG.DEPTH.DEFAULT)

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
  }, []);

  const getEngineFen = useCallback(
    (fen: string): Promise<{ fen: string; bestmove: string }> => {
      return new Promise((resolve, reject) => {
        if (!stockfishRef.current) {
          return reject("Stockfish is not initialized");
        }

        let bestMove = "";
        

        stockfishRef.current.onmessage = (event) => {
          const message = event.data;
          

          if (message.includes("Fen:")) {
            
            const fullFen = message.split("Fen: ")[1];
            resolve({ fen: fullFen, bestmove: bestMove });
          }

          if (message.startsWith("bestmove")) {
            bestMove = message.split(" ")[1]; // bestmove a7a6 to a7a6
            stockfishRef.current?.postMessage(
              `position fen ${fen} moves ${bestMove}`
            );
            stockfishRef.current?.postMessage("d"); // Request the new full FEN
          }
        };

        stockfishRef.current.postMessage("uci");
        stockfishRef.current.postMessage(`position fen ${fen}`);
        stockfishRef.current.postMessage(`go depth ${ENGINE_CONFIG.DEPTH.DEFAULT}`);
      });
    },
    []
  );

  const getEvalution = useCallback(
    (fen: string): Promise<{ winner: string; evaluation: number }> => {
      return new Promise((resolve, reject) => {
        if (!stockfishRef.current) {
          return reject("Stockfish is not initialized");
        }

        let evaluation = 0;

        stockfishRef.current.onmessage = (event) => {
          const message = event.data;

          if (message.startsWith("info depth")) {
            const parts = message.split(" ");
            const scoreIndex = parts.indexOf("score");
            console.log(scoreIndex)
            if (scoreIndex !== -1) {
              const scoreType = parts[scoreIndex + 1];
              const scoreValue = parseInt(parts[scoreIndex + 2], 10);
              evaluation = scoreType === "cp" ? scoreValue / 100 : scoreValue;
            }
          }

          if (message.includes("bestmove")) {
            let winner = "draw";
            if (evaluation > 0) {
              winner = "white";
            } else if (evaluation < 0) {
              winner = "black";
            }
            resolve({ winner, evaluation });
          }
        };

        stockfishRef.current.postMessage("uci");
        stockfishRef.current.postMessage(`position fen ${fen}`);
        stockfishRef.current.postMessage(`go depth ${ENGINE_CONFIG.DEPTH.DEFAULT}`);
      });
    },
    [engineDepth]
  );

  return { getEngineFen, engineDepth, setEngineDepth, getEvalution };
}

export default useStockfish;
