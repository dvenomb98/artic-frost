"use client";

import React from "react";
import dynamic from "next/dynamic";

import {ChessState, INITIAL_CHESS_STATE} from "@chess/store/definitions";

import {ChessProvider} from "@chess/context/chess-state-manager";

import UserRow from "./user-row";
import ChessSidebar from "./chess-sidebar";
import ChessBoard from "./chess-board";
import {convertRawToState} from "../api/utils";

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
  rawData: unknown;
  userId: string;
}) {
  const state = convertRawToState(rawData);

  const providedValues: ChessState = {
    ...state,
    selectedPiece: INITIAL_CHESS_STATE.selectedPiece,
    possibleMoves: INITIAL_CHESS_STATE.possibleMoves,
    currentUserId: userId,
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
