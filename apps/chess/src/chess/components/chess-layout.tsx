import React from "react";
import { ChessProvider } from "../context/chess-state-manager";
import ChessBoard from "./chess-board";
import { RawGameData } from "@/lib/supabase/definitions";
import { parseFen, parseMoveHistory } from "../lib/fen";
import { ChessState, initialState } from "../lib/definitions";
import UserRow from "./user-row";
import ChessSidebar from "./chess-sidebar";
import dynamic from "next/dynamic"

const EndGameDialog = dynamic(() => import ("./end-game-dialog"), {ssr: false})

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
    winnerId: rawData.winnerId,
    movesHistory,
    type: rawData.type
  };

  return (
    <ChessProvider providedValues={providedValues}>
      <>
      <section className="grid grid-cols-3 sm:grid-cols-1 gap-5 lg:max-w-[875px] sm:max-w-[500px] mx-auto">
        <div className="lg:col-span-2">
        <UserRow targetUser="opponent" />
        <ChessBoard />
        <UserRow targetUser="current" />
        </div>
        <ChessSidebar />
      </section>
      <EndGameDialog />
      </>
    </ChessProvider>
  );
}
