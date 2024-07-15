import React from "react";
import { ChessProvider } from "../context/chess-state-manager";
import ChessBoard from "./chess-board";

export default function ChessLayout() {
  return (
    <ChessProvider>
      <section>
        <ChessBoard />
      </section>
    </ChessProvider>
  );
}
