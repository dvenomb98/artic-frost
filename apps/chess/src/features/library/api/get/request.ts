import "server-only";

import {createClient, getUserId} from "@/services/supabase/server";
import {DbSave} from "../../lib/types";

async function getSaves(): Promise<DbSave[]> {
  const supabase = await createClient();
  const userId = await getUserId();

  const {data} = await supabase
    .from("saves")
    .select("fen, id, created_at, title")
    .eq("user_id", userId)
    .throwOnError();

  return data.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export {getSaves};
