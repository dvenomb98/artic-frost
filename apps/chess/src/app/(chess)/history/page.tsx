import UserGames from "@/features/analytics/components/user-games";
import { getUserGamesData } from "@/features/analytics/api/requests/get-user-games";

import React from "react";

export default async function HistoryPage() {
  const data = await getUserGamesData();
  return <UserGames providedData={data} />;
}
