import "server-only";

import { createClient } from "@/services/supabase/server";
import { UserService } from "@/services/supabase/api/server/user";

import { cache } from "react";
import { Tables } from "@/services/supabase/tables";
import { z } from "zod";
import { RAW_GAME_SCHEMA } from "@/services/supabase/models";
import { registeredOnly } from "@/lib/protected";

async function getAnalyticsData() {
  const client = await createClient();
  const userData = await UserService.getUserData(client);

  registeredOnly(userData.is_anonymous)

  const { data, error } = await client
    .from(Tables.GAMES_DATA)
    .select("*")
    .neq("status", "CANCELLED")
    .or(`user_black_id.eq.${userData.id},user_white_id.eq.${userData.id}`);

  if (error) throw error;

  const parsedData = z.array(RAW_GAME_SCHEMA).parse(data);

  return { data: parsedData, userData };
}

const cached_getAnalyticsData = cache(async () => await getAnalyticsData());
type AnalyticsData = Awaited<ReturnType<typeof cached_getAnalyticsData>>;

export { cached_getAnalyticsData, type AnalyticsData };