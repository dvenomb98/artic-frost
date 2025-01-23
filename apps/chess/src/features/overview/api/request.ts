import { createClient } from "@/services/supabase/server";
import { UserService } from "@/services/supabase/api/server/user";
import { Tables } from "@/services/supabase/tables";
import { RawGameData } from "@/services/supabase/definitions";
import { cache } from "react";

async function getAnalyticsData() {
  const client = await createClient();
  const { data, userData } = await UserService.getUserGamesHistory(client);
  const gamesDataPromises = data.map(async history => {
    const { data: gameData, error: gameError } = await client
      .from(Tables.GAMES_DATA)
      .select("*")
      .eq("id", history.game_id)
      .single<RawGameData>();
    if (gameError) throw gameError;
    return gameData;
  });

  const gamesData = await Promise.all(gamesDataPromises);

  return { gamesData, userData };
}

const cached_getAnalyticsData = cache(async () => await getAnalyticsData());

type AnalyticsData = Awaited<ReturnType<typeof cached_getAnalyticsData>>;

export { cached_getAnalyticsData, type AnalyticsData };
