import UserGames from "@/components/hp/user-games";
import { getUserGamesData } from "@/lib/supabase/requests/server-only/get-user-games";

import React from "react";

export default async function HistoryPage() {
  const data = await getUserGamesData();
  return <UserGames providedData={data} />;
}
