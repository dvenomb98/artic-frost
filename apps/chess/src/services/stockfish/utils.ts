import {ENGINE_CONFIG} from "./config";

import {EngineDifficultyKeys} from "@/services/models";

function isWasmSupported() {
  return (
    typeof WebAssembly === "object" &&
    WebAssembly.validate(
      Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
    )
  );
}

function createStockfishWorker() {
  const wasmSupport = isWasmSupported();
  return new Worker(wasmSupport ? "/stockfish.wasm.js" : "/stockfish.js");
}

function parseEngineMove(bestMove: string) {
  const prevColIndex = bestMove.charCodeAt(0) - 97; // 'a' => 0, 'b' => 1, ...
  const prevRowIndex = 8 - parseInt(bestMove.charAt(1)); // '1' (engine) -> 7 (board), '8' -> 0
  const colIndex = bestMove.charCodeAt(2) - 97;
  const rowIndex = 8 - parseInt(bestMove.charAt(3)); // '1' (engine) -> 7 (board), '8' -> 0

  return {
    colIndex,
    rowIndex,
    prevColIndex,
    prevRowIndex,
  };
}

function getConfig(diff: EngineDifficultyKeys) {
  return ENGINE_CONFIG[diff];
}

export {parseEngineMove, isWasmSupported, createStockfishWorker, getConfig};
