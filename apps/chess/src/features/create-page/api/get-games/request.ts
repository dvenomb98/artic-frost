import "server-only";

import {createClient, getUserId} from "@/services/supabase/server";


async function getGames() {
  const userId = await getUserId();
  const supabase = await createClient();

  const {data} = await supabase
    .from("play")
    .select("*")
    .or(`white_player.eq.${userId},black_player.eq.${userId}`)
    .is("result", null)
    .order("created_at", {ascending: false})
    .throwOnError();

  return data;
}

export {getGames};
