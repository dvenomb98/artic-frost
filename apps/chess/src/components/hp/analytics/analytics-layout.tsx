import {
  getUserGamesData,
  IGetUserGamesData,
} from "@/lib/supabase/requests/server-only/get-user-games";
import React from "react";
import { GameStates } from "./game-states";
import { UserStates } from "./user-states";
import { Alert, AlertDescription, AlertTitle, Skeleton } from "@ui/components";
import TotalGames from "./total-games";

export function AnalyticsSuspense() {
  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-1">
      <Skeleton className="w-full h-[425px]" />
      <Skeleton className="w-full h-[425px]" />
    </section>
  );
}

export default async function AnalyticsLayout({
  providedData,
}: {
  providedData?: IGetUserGamesData;
}) {
  const data = providedData || (await getUserGamesData());
  let gameStateOccurrences = new Set();

  for (const game of data.gamesData) {
    if (["CHECKMATE", "DRAW", "SURRENDER"].includes(game.gameState)) {
      gameStateOccurrences.add(game.gameState);
    }
  }
  
  const unavailable = !data.gamesData.length || gameStateOccurrences.size < 1

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
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-1">
      <GameStates data={data} />
      <UserStates data={data} />
      <TotalGames data={data} />
    </section>
  );
}
