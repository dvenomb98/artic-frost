import React from "react";
import { ChessProvider } from "../context/chess-state-manager";
import ChessBoard from "./chess-board";
import { RawGameData } from "@/utils/supabase/definitions";
import { parseFen, parseMoveHistory } from "../lib/fen";
import { ChessState, initialState } from "../lib/definitions";
import UserRow from "./user-row";
import ChessSidebar from "./chess-sidebar";

export default function ChessLayout({ rawData, userId }: { rawData: RawGameData; userId: string }) {
  const dataFromFen = parseFen(rawData.fen);
  const movesHistory = parseMoveHistory(rawData.movesHistory)

  const providedValues: ChessState = {
    ...dataFromFen,
    users: rawData.users,
    id: rawData.id,
    gameState: rawData.gameState,
    selectedPiece: initialState.selectedPiece,
    possibleMoves: initialState.possibleMoves,
    currentUserId: userId,
    chat: rawData.chat,
    movesHistory,
  
  };

  return (
    <ChessProvider providedValues={providedValues}>
      <section className="grid grid-cols-3 sm:grid-cols-1 gap-5">
        <div className="lg:col-span-2">
        <UserRow user={providedValues.users.find(u => u.id !== userId)!} />
        <ChessBoard />
        <UserRow user={providedValues.users.find(u => u.id === userId)!} />
        </div>
        <ChessSidebar />
      </section>
    </ChessProvider>
  );
}
