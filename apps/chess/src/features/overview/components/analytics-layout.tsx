import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@ui/components";

import { GameStates } from "./game-states";
import { UserStates } from "./user-states";
import TotalGames from "./total-games";

import { cached_getAnalyticsData } from "../api/request";

export default async function AnalyticsLayout() {
  const data = await cached_getAnalyticsData();
  let gameStateOccurrences = new Set();

  for (const game of data.gamesData) {
    if (["CHECKMATE", "DRAW", "SURRENDER"].includes(game.game_state ?? "")) {
      gameStateOccurrences.add(game.game_state);
    }
  }

  const unavailable = !data.gamesData.length || gameStateOccurrences.size < 1;

  if (unavailable)
    return (
      <Alert>
        <AlertTitle>Analytics Unavailable</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          You haven't played enough games to generate analytics. Please play
          more games to unlock this feature.
        </AlertDescription>
      </Alert>
    );

  return (
    <section className="grid lg:grid-cols-2 gap-4 grid-cols-1">
      <GameStates data={data} />
      <UserStates data={data} />
      <TotalGames data={data} />
    </section>
  );
}
