"use client";
import React, { useState } from "react";
import { useChessManager } from "@/chess/context/chess-state-manager";
import { createPlayConfigArray } from "@/services/stockfish/helpers";
import { Button } from "@ui/components/ui/button";

const configArr = createPlayConfigArray()

export default function EngineActions() {
  const { state, setEngineConfig } = useChessManager();
  const [active, setActive] = useState<number>(1)

  if (state.type !== "engine") return null;

  return (
    <div className="space-y-3">
        <h4 className="text-sm">Difficulty</h4>
       <div className="flex justify-between gap-0.5">
        {configArr.map(({label, config}, index) => (
          <Button key={label} variant={active  === index ? "default" : "outline"} className="text-xs w-full" size="sm" onClick={() => {
            setEngineConfig(config)
            setActive(index)
          }}>
            {label}
          </Button>
        ))}
       </div>
    </div>
 
  );
}
