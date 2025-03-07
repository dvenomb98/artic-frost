import {registeredOnly} from "@/lib/protected";
import {UserService} from "@/services/supabase/api/server/user";
import {RAW_GAME_SCHEMA} from "@/services/supabase/models";
import {createClient} from "@/services/supabase/server";
import {Tables} from "@/services/supabase/tables";
import {z} from "zod";

async function getTableData() {
  const client = await createClient();
  const userData = await UserService.getUserData(client);

  registeredOnly(userData.is_anonymous);

  const {data, error} = await client
    .from(Tables.GAMES_DATA)
    .select("*")
    .or(`user_black_id.eq.${userData.id},user_white_id.eq.${userData.id}`);

  if (error) throw error;

  const parsedData = z.array(RAW_GAME_SCHEMA).parse(data);

  return {data: parsedData, userData};
}

export {getTableData};
