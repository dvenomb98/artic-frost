"use client";

import React from "react";
import dynamic from "next/dynamic";
import { parseFen } from "chess-lite/fen";

import { RawGameData } from "@/services/supabase/definitions";

import {
  ChessState,
  INITIAL_CHESS_STATE,
} from "@/features/chess/store/definitions";
import { parseMoveHistory } from "@/features/chess/store/helpers";
import { ChessProvider } from "@/chess/context/chess-state-manager";

import UserRow from "./user-row";
import ChessSidebar from "./chess-sidebar";
import ChessBoard from "./chess-board";

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
    selectedPiece: INITIAL_CHESS_STATE.selectedPiece,
    possibleMoves: INITIAL_CHESS_STATE.possibleMoves,
    currentUserId: userId,
    chat: rawData.chat,
    winnerId: rawData.winnerId,
    movesHistory,
    type: rawData.type,
  };

  return (
    <ChessProvider providedValues={providedValues}>
      <>
        <section className="flex lg:flex-row flex-col h-full justify-end">
          <div className="flex-1 w-full lg:max-w-[600px] place-self-center 3xl:max-w-[800px] p-5 mx-auto">
            <UserRow targetUser="opponent" />
            <ChessBoard />
            <UserRow targetUser="current" />
          </div>
          <aside className="lg:max-w-[350px] lg:w-[350px] w-full lg:border-l p-5 lg:p-0">
            <ChessSidebar />
          </aside>
        </section>
        <EndGameDialog />
        <ShareLinkDialog />
      </>
    </ChessProvider>
  );
}
