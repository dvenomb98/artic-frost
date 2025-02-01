import "server-only";

import { UserService } from "@/services/supabase/api/server/user";
import { createClient } from "@/services/supabase/server";
import { Tables } from "@/services/supabase/tables";
import { RAW_GAME_SCHEMA } from "@/services/supabase/models";

async function getUserCurrentGame() {
  const client = await createClient();
  const userData = await UserService.getUserData(client);

  const { data, error } = await client
    .from(Tables.GAMES_DATA)
    .select("id, status, created_at")
    .in("status", ["IN_QUEUE", "IN_PROGRESS"])
    .or(`user_black_id.eq.${userData.id},user_white_id.eq.${userData.id}`)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const parsedData = RAW_GAME_SCHEMA.pick({
    id: true,
    status: true,
    created_at: true,
  }).parse(data);

  return {
    id: parsedData.id,
    status: parsedData.status,
    created_at: parsedData.created_at,
  };
}

export { getUserCurrentGame };
