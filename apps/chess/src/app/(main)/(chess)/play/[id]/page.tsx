import ChessLayout from "@/chess/components/chess-layout";
import { createUserHistory } from "@/features/chess/api/actions";
import { createClient } from "@/services/supabase/server";
import { Tables } from "@/services/supabase/tables";
import React from "react";
import { UserService } from "@/services/supabase/api/server/user";
import { RAW_GAME_SCHEMA } from "@/services/supabase/models";

async function PlayPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const client = await createClient();
  const userData = await UserService.getUserData();
  const { data: gameData, error: dataError } = await client
    .from(Tables.GAMES_DATA)
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();

  if (dataError) {
    throw dataError;
  }

  const parsedData = RAW_GAME_SCHEMA.parse(gameData);
  const missingUser = parsedData.users.find(u => !u.id);
  const isCurrentUser = parsedData.users.some(u => u.id === userData.id);

  if (!missingUser) {
    // if both users are defined, check if some of users is current user, and do nothing
    if (!isCurrentUser) {
      throw new Error("Sorry, this game is already full");
    }
  } else {
    if (!isCurrentUser) {
      // false = we assume another user can join game
      const newUsers = parsedData.users.map(u => ({
        ...u,
        id: u.id ? u.id : userData.id,
      }));

      const { data: rawGameData, error: updateError } = await client
        .from(Tables.GAMES_DATA)
        .update({ users: newUsers })
        .eq("id", id)
        .select("*")
        .returns<unknown[]>();

      if (updateError) throw updateError;

      await createUserHistory(id, client);

      return <ChessLayout rawData={rawGameData[0]!} userId={userData.id} />;
    }
  }

  return <ChessLayout rawData={parsedData} userId={userData.id} />;
}

export default PlayPage;
