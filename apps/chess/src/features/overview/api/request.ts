import { createClient } from "@/services/supabase/server";
import { UserService } from "@/services/supabase/api/server/user";

import { cache } from "react";

async function getAnalyticsData() {
  const client = await createClient();
  const { data, userData } = await UserService.getUserGamesHistory(client);

  return { gamesData: data, userData };
}

const cached_getAnalyticsData = cache(async () => await getAnalyticsData());

type AnalyticsData = Awaited<ReturnType<typeof cached_getAnalyticsData>>;

export { cached_getAnalyticsData, type AnalyticsData };
