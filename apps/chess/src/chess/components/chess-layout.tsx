import React from "react";
import { ChessProvider } from "../context/chess-state-manager";
import ChessBoard from "./chess-board";
import { RawGameData } from "@/lib/supabase/definitions";
import { parseFen, parseMoveHistory } from "../lib/fen";
import { ChessState, initialState } from "../lib/definitions";
import UserRow from "./user-row";
import ChessSidebar from "./chess-sidebar";
import dynamic from "next/dynamic";

const ShareLinkDialog = dynamic(() => import("./share-link-dialog"), {
  ssr: false,
});
const EndGameDialog = dynamic(() => import("./end-game-dialog"), {
  ssr: false,
});

export default function ChessLayout({
  rawData,
  userId,
}: {
  rawData: RawGameData;
  userId: string;
}) {
  const dataFromFen = parseFen(rawData.fen);
  const movesHistory = parseMoveHistory(rawData.movesHistory);

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
    type: rawData.type,
  };

  return (
    <ChessProvider providedValues={providedValues}>
      <>
        <section className="flex w-full sm:flex-col sm:max-w-[500px] lg:max-w-[850px] mx-auto">
          <div className="flex-1 lg:pr-[350px]">
            <UserRow targetUser="opponent" />
            <ChessBoard />
            <UserRow targetUser="current" />
          </div>
          <aside className="lg:fixed lg:inset-y-0 lg:right-0 lg:z-10 lg:w-[350px] sm:w-full lg:border-l">
            <ChessSidebar />
          </aside>
        </section>
        <EndGameDialog />
        <ShareLinkDialog />
      </>
    </ChessProvider>
  );
}
