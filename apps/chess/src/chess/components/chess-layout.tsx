import React from "react";
import { ChessProvider } from "../context/chess-state-manager";
import ChessBoard from "./chess-board";
import { RawGameData } from "@/utils/supabase/definitions";
import { parseFen } from "../lib/fen";
import { ChessState, initialState } from "../lib/definitions";

export default function ChessLayout({ rawData, userId }: { rawData: RawGameData, userId: string }) {
  const dataFromFen = parseFen(rawData.fen);

  const providedValues: ChessState = {
    ...dataFromFen,
    users: rawData.users,
    id: rawData.id,
    gameState: rawData.gameState,
    selectedPiece: initialState.selectedPiece,
    possibleMoves: initialState.possibleMoves,
    currentUserId: userId
  };


  return (
    <ChessProvider providedValues={providedValues}>
      <section>
        <ChessBoard />
      </section>
    </ChessProvider>
  );
}
