import React from "react";
import UserGames from "./user-games";
import { getUserGamesData } from "@/utils/supabase/requests/server-only/get-user-games";
import AnalyticsLayout, {
} from "./analytics/analytics-layout";
import { Loader } from "lucide-react";

export function HpContentSuspense() {
  return (
    <div className="w-full grid place-content-center">
      <div className="flex gap-2 items-center text-muted-foreground">
        <Loader width={20} height={20} className="animate-spin" />
        <span className="text-sm">Loading data...</span>
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
      {(!currentParam || currentParam === "game-history") && (
        <UserGames providedData={data} />
      )}
      {currentParam === "analytics" && <AnalyticsLayout providedData={data} />}
    </>
  );
}
