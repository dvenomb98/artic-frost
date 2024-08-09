
import { useCallback, useEffect, useRef } from "react";



/**
* Description of the universal chess interface (UCI)
* https://gist.github.com/aliostad/f4470274f39d29b788c1b09519e67372
* 
* @param {string} shouldInit - init only when gametype === "engine"
* 
*/
function useStockfish(shouldInit: boolean) {
  const stockfishRef = useRef<Worker | null>(null);

  useEffect(() => {
    if(!shouldInit) return

    if (!stockfishRef.current) {
      stockfishRef.current = new Worker('/stockfish.js');
    }

    return () => {
      if (stockfishRef.current) {
        stockfishRef.current.terminate();
        stockfishRef.current = null;
      }
    };
  }, []);

  const getNewFen = useCallback((fen: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!stockfishRef.current) {
        return reject('Stockfish is not initialized');
      }

      stockfishRef.current.onmessage = (event) => {
        const message = event.data;

        if (message.includes('Fen:')) {
          const fullFen = message.split('Fen: ')[1]
          resolve(fullFen);
        }

        if (message.startsWith('bestmove')) {
          const bestMove = message.split(' ')[1];  // bestmove a7a6
          stockfishRef.current?.postMessage(`position fen ${fen} moves ${bestMove}`);
          stockfishRef.current?.postMessage('d'); // Request the new full FEN
        }
      };

      stockfishRef.current.postMessage('uci');
      stockfishRef.current.postMessage(`position fen ${fen}`);
      stockfishRef.current.postMessage('go');
    });
  }, []);

  return { getNewFen };
}

export default useStockfish;
