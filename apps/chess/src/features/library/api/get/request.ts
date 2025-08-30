import "server-only";

import {createClient} from "@/services/supabase/server";
import {DbSavesTableRow} from "@/services/supabase/types";

async function getSaves(): Promise<Omit<DbSavesTableRow, "user_id">[]> {
  const supabase = await createClient();
  const {data: user, error: userError} = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  const {data} = await supabase
    .from("saves")
    .select("fen, id, created_at, title")
    .eq("user_id", user.user.id)
    .throwOnError();

  return data;
}

export {getSaves};
