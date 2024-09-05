"use client";

import React from "react";
import { useChessManager } from "../context/chess-state-manager";
import Square from "./square";
import { cn } from "@ui/lib";
import { getCurrentUser } from "../lib/users";

export default function ChessBoard() {
  const {
    state: { boardState, users, currentUserId },
  } = useChessManager();

  const user = getCurrentUser(currentUserId, users)!;

  return (
    <section
      className={cn(
        "grid grid-cols-8 grid-rows-8",
        user.role === "BLACK" && "tranform rotate-180"
      )}
    >
      {boardState.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            piece={piece}
            colIndex={colIndex}
            rowIndex={rowIndex}
          />
        ))
      )}
    </section>
  );
}
