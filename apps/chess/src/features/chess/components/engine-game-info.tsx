"use client";

import { useChessManager } from "@chess/context/chess-state-manager";

function EngineGameInfo() {
  const { state } = useChessManager();

  if (state.type !== "engine") return null;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Difficulty</h4>
      <p className="text-muted-foreground text-sm first-letter:capitalize lowercase">
        {state.engineDifficulty}
      </p>
    </div>
  );
}

export { EngineGameInfo };
