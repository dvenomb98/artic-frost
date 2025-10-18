import "server-only";

import {createClient, getUserId} from "@/services/supabase/server";
import {DbSavesTableRow} from "@/services/supabase/types";

async function getSaves(): Promise<DbSavesTableRow[]> {
  const supabase = await createClient();
  const userId = await getUserId();

  const {data} = await supabase
    .from("saves")
    .select("*")
    .eq("user_id", userId)
    .throwOnError();

  return data.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export {getSaves};
