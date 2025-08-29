"use client";

import {useEndgame} from "../hooks/use-endgame";
import {useInvite} from "../hooks/use-invite";
import {useRealtime} from "../hooks/use-realtime";

import {PlayLayout} from "./play-layout";

/**
 *
 * Core logic holder around the game.
 *
 */
function PlayInner() {
  // Responsive for invite dialog popup.
  useInvite();

  // Realtime connection to the database.
  useRealtime();

  // Endgame dialog.
  useEndgame();

  return (
    <>
      <PlayLayout />
    </>
  );
}

export {PlayInner};
