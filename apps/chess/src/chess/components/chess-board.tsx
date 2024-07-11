"use client"
import React from "react";
import { useChessManager } from "../context/chess-state-manager";
import Square from "./square";

interface ChessBoardProps {

}

export default function ChessBoard() {

  const {
    state: { boardState},
  } = useChessManager();

  return (
    <section className="grid grid-cols-8 grid-rows-8">
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
