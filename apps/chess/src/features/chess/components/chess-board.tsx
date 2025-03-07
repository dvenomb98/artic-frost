"use client";

import React from "react";
import {cn} from "@artic-frost/ui/lib";

import {useChessManager} from "../context/chess-state-manager";
import {getUserRole} from "../store/utils";
import Square from "./square";

export default function ChessBoard() {
  const {
    state: {board, userWhiteId, currentUserId},
  } = useChessManager();

  const role = getUserRole(currentUserId, userWhiteId);

  return (
    <section
      className={cn(
        "grid grid-cols-8 grid-rows-8",
        role === "BLACK" && "tranform rotate-180"
      )}>
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
