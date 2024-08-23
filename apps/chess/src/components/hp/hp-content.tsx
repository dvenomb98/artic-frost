import React, { Suspense } from "react";
import UserGames, { UserGamesLoading } from "./user-games";
import { getUserGamesData } from "@/utils/supabase/requests/server-only/get-user-games";
import AnalyticsLayout, { AnalyticsSuspense } from "./analytics/analytics-layout";
import { Loader } from "lucide-react";

export function HpContentSuspense() {
  return (
    <div className="w-full grid place-content-center">
      <div className="flex gap-2 items-center text-muted-foreground">
        <Loader width={20} height={20} className="animate-spin" />
        <span className="text-sm">Loading initial data...</span>
      </div>
    </div>
  );
}

export default async function HpContent({
  currentParam,
}: {
  currentParam?: string;
}) {
  const data = await getUserGamesData();
  return (
    <>
      {(!currentParam ||currentParam === "game-history") && (
          <Suspense fallback={<UserGamesLoading />}>
            <UserGames providedData={data} />
          </Suspense>
      )}
      {currentParam === "analytics" && (
        <Suspense fallback={<AnalyticsSuspense />}>
          <AnalyticsLayout providedData={data} />
        </Suspense>
      )}
    </>
  );
}
