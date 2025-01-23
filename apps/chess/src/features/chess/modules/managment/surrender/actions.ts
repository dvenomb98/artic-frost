"use server";

import { createClient } from "@/services/supabase/server";
import { Tables } from "@/services/supabase/tables";
import { SURRENDER_SCHEMA } from "./models";
import { GameState } from "@/features/chess/store/definitions";
import { ChessUser } from "@/features/chess/store/definitions";
import { UserService } from "@/services/supabase/api/server/user";

async function surrender(gameId: string) {
  try {
    const { gameId: id } = SURRENDER_SCHEMA.parse({ gameId });

    const client = await createClient();
    const userData = await UserService.getUserData(client);

    const { data, error: getError } = await client
      .from(Tables.GAMES_DATA)
      .select("users, gameState")
      .eq("id", id)
      .single<{ users: ChessUser[]; gameState: GameState }>();

    if (getError) throw getError;

    if (!!data.gameState) throw new Error("Game already ended!");

    const winner = data.users.find(u => u.id !== userData.id && !!u.id);

    if (!winner) {
      throw new Error("Wait for other player to join!");
    }

    const { error: updateError } = await client
      .from(Tables.GAMES_DATA)
      .update({ winnerId: winner.id, gameState: "SURRENDER" })
      .eq("id", gameId);

    if (updateError) throw updateError;

  } catch (e) {
    throw e;
  }
}

export { surrender };
