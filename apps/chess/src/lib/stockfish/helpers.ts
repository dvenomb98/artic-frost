import { ENGINE_CONFIG } from "./config";

const wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));

function parseEngineMove(bestMove: string) {
  const colIndex = bestMove.charCodeAt(0) - 97; // 'a' => 0, 'b' => 1, ...
  const rowIndex = 8 - parseInt(bestMove.charAt(1)); // '1' (engine) -> 7 (board), '8' -> 0
  
  const targetColIndex = bestMove.charCodeAt(2) - 97;
  const targetRowIndex = 8 - parseInt(bestMove.charAt(3)); // '1' (engine) -> 7 (board), '8' -> 0
  
  return {
    colIndex,
    rowIndex,
    targetColIndex,
    targetRowIndex
  };
}

function createPlayConfigArray() {
  return Object.keys(ENGINE_CONFIG.PLAY).map(difficulty => ({
    label: difficulty,
    config: ENGINE_CONFIG.PLAY[difficulty as keyof typeof ENGINE_CONFIG.PLAY]
  }));
}

  export { parseEngineMove, createPlayConfigArray, wasmSupported }