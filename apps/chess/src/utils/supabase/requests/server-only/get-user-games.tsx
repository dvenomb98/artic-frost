import { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "../../server";
import { Tables } from "../../tables";
import { RawGameData, UserGamesData } from "../../definitions";

interface IGetUserGamesData {
  gamesData: RawGameData[];
  userData: {
    user: User;
  };
}

async function getUserGamesData(
  providedClient?: SupabaseClient<any, "public", any>
) {
  const client = providedClient ?? createClient();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;

  const { data: gameIdsData, error: gamesIdsError } = await client
    .from(Tables.USER_GAMES_HISTORY)
    .select("game_id")
    .returns<UserGamesData[]>();
  if (gamesIdsError) throw gamesIdsError;

  const gamesDataPromises = gameIdsData.map(async history => {
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

export { getUserGamesData, type IGetUserGamesData };
