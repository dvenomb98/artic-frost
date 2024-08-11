"use client";
import React from "react";
import { useChessManager } from "../context/chess-state-manager";
import { Slider } from "@ui/components/ui/slider";
import { ENGINE_CONFIG } from "@/utils/stockfish/config";

export default function EngineActions() {
  const { state, engineDepth, setEngineDepth } = useChessManager();
  if (state.type !== "engine") return null;

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <h4 className="text-sm">Difficulty</h4>
        <p className="text-sm text-muted-foreground">{engineDepth} / 10</p>
      </div>
      <Slider
        min={ENGINE_CONFIG.DEPTH.MIN}
        max={ENGINE_CONFIG.DEPTH.MAX}
        defaultValue={[ENGINE_CONFIG.DEPTH.DEFAULT]}
        onValueChange={(v) => setEngineDepth(v[0]!)}
        value={[engineDepth]}
      />
    </div>
  );
}
