function parseEngineMove(bestMove: string) {
  const colIndex = bestMove.charCodeAt(0) - 97; // 'a' => 0, 'b' => 1, ...
  
  // Adjust row index to fit your board (invert the index)
  const rowIndex = 8 - parseInt(bestMove.charAt(1)); // '1' (engine) -> 7 (your board), '8' -> 0
  
  const targetColIndex = bestMove.charCodeAt(2) - 97;
  
  // Adjust target row index to fit your board (invert the index)
  const targetRowIndex = 8 - parseInt(bestMove.charAt(3)); // '1' (engine) -> 7 (your board), '8' -> 0
  
  return {
    colIndex,
    rowIndex,
    targetColIndex,
    targetRowIndex
  };
}

  export {parseEngineMove}