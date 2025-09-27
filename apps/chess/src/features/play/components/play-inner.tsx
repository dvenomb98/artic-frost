"use client";

import {useInvite} from "../hooks/use-invite";
import {useRealtime} from "../hooks/use-realtime";
import {useEndgame} from "../hooks/use-endgame";

import {Board} from "./board";
import {PlayerRow} from "./player-row";
import {Sidebar} from "./sidebar";

import {ChessInset} from "@/components/chess-inset";

function PlayInner() {
  // Responsive for invite dialog popup.
  useInvite();

  // Realtime connection to the database.
  useRealtime();

  // Endgame dialog.
  useEndgame();

  return (
    <ChessInset
      sidebar={<Sidebar />}
      board={<Board />}
      upperRow={<PlayerRow type="opponent" />}
      bottomRow={<PlayerRow type="current" />}
    />
  );
}

export {PlayInner};
