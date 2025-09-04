import "server-only";

import {createClient} from "@/services/supabase/server";
import {DbSave} from "../../lib/types";

async function getSaves(): Promise<DbSave[]> {
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

  return data.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export {getSaves};
