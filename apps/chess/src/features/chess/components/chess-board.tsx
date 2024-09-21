"use client";

import React from "react";
import { cn } from "@ui/lib";

import { useChessManager } from "../context/chess-state-manager";
import { getCurrentUser } from "../store/utils"
import Square from "./square";

export default function ChessBoard() {
  const {
    state: { board, users, currentUserId },
  } = useChessManager();

  const user = getCurrentUser(currentUserId, users)!;

  return (
    <section
      className={cn(
        "grid grid-cols-8 grid-rows-8",
        user.role === "BLACK" && "tranform rotate-180"
      )}
    >
      {board.map((row, rowIndex) =>
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
