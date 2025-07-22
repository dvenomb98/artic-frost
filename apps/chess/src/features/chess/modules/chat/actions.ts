"use server";

import {createClient} from "@/services/supabase/server";
import {COMMENT_SCHEMA} from "./schema";
import {Tables} from "@/services/supabase/tables";
import {UserService} from "@/services/supabase/api/server/user";
import {FormState, handleFormErrors} from "@/lib/forms";

async function submitComment(_: FormState, formData: FormData) {
  try {
    const {text, gameId: id} = COMMENT_SCHEMA.parse({
      text: formData.get("text"),
      gameId: formData.get("gameId"),
    });

    const client = await createClient();
    const userData = await UserService.getUserData(client);

    // Get current chat directly from db
    const {data, error: getError} = await client
      .from(Tables.GAMES_DATA)
      .select("chat")
      .eq("id", id)
      .limit(1)
      .single();

    if (getError) throw getError;

    const timestamp = Math.floor(Date.now() / 1000);

    const mutatedChat = data.chat || [];
    const dataToSend = {
      text,
      userId: userData.id,
      timestamp,
    };

    mutatedChat.push(dataToSend);

    // Update old chat
    const {error: updateError} = await client
      .from(Tables.GAMES_DATA)
      .update({chat: mutatedChat})
      .eq("id", id);

    if (updateError) throw updateError;

    return {success: true, message: ""};
  } catch (e) {
    return handleFormErrors(e);
  }
}

export {submitComment};
