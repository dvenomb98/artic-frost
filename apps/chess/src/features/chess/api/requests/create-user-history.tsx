import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/services/supabase/server";
import { Tables } from "@/services/supabase/tables";

async function createUserHistory(
  game_id: string,
  providedClient?: SupabaseClient<any, "public", any>
) {
  try {
    const client = providedClient ?? await createClient();

    const { error } = await client
      .from(Tables.USER_GAMES_HISTORY)
      .insert({ game_id });

    if (error) throw error;
  } catch (e) {
    throw e;
  }
}

export { createUserHistory };
