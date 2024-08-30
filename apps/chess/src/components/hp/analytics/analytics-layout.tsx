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

  if (!data.gamesData.length)
    return (
      <Alert>
        <AlertTitle>No games available!</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Play some games to see your statistics
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
