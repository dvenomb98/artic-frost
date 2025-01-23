"use server";

import { handleFormErrors } from "@/lib/forms";
import { UserService } from "@/services/supabase/api/server/user";
import { createClient } from "@/services/supabase/server";
import { redirect } from "next/navigation";

async function findGame() {
  let redirectId: string | null = null;
  try {
    const client = await createClient();
    const userData = await UserService.getUserData(client);

    const { data: gamesData, error: gamesError } = await client
      .rpc("find_game", { user_id: userData.id })
      .returns<Array<{ id: string }>>();

    if (gamesError) throw gamesError;

    if (!gamesData[0]?.id) {
      throw new Error(
        "Sorry, it seems like there are not games to join. Try to create your own."
      );
    }

    redirectId = gamesData[0].id;
    return {
      success: true,
      message: ""
    };
  } catch (e) {
    return handleFormErrors(e);
  } finally {
    redirect(`/play/${redirectId}`);
  }
}

export { findGame };
