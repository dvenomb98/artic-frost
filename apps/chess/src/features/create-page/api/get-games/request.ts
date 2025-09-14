import "server-only";

import {createClient} from "@/services/supabase/server";

async function getGames() {
  const supabase = await createClient();

  const {data: user, error: userError} = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  const {data} = await supabase
    .from("play")
    .select("*")
    .or(`white_player.eq.${user.user.id},black_player.eq.${user.user.id}`)
    .is("result", null)
    .order("created_at", {ascending: false})
    .throwOnError();

  return data;
}

export {getGames};
