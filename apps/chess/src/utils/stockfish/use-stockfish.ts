import { useCallback, useEffect, useRef, useState } from "react";
import { ENGINE_CONFIG } from "./config";


/**
 * Description of the universal chess interface (UCI)
 * https://gist.github.com/aliostad/f4470274f39d29b788c1b09519e67372
 *
 * @param {string} shouldInit - init only when gametype === "engine"
 * @param {boolean} debug - console info about current engine state
 *
 */
function useStockfish(shouldInit: boolean = false, debug: boolean = false) {
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
            if (debug) {
              console.log("Best move calculated:", bestMove);
            }
            stockfishRef.current?.postMessage(
              `position fen ${fen} moves ${bestMove}`
            );
            stockfishRef.current?.postMessage("d"); // Request the new full FEN
          }
        };

        if (debug) {
          console.log("Initializing Stockfish with UCI...");
          console.log("Setting position with FEN:", fen);
          console.log("Starting engine with depth:", engineDepth);
        }

        stockfishRef.current.postMessage("uci");
        stockfishRef.current.postMessage(`position fen ${fen}`);
        stockfishRef.current.postMessage(`go depth ${engineDepth}`);
      });
    },
    [engineDepth, debug]
  );

  return { getEngineFen, engineDepth, setEngineDepth };
}

export default useStockfish;
