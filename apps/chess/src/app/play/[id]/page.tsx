import ChessLayout from "@/chess/components/chess-layout";
import { RawGameData } from "@/utils/supabase/definitions";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/utils/supabase/tables";
import React from "react";

export default async function PlayPage({ params: { id } }: { params: { id: string } }) {
  const client = createClient();
  const { data: userData, error: userError } = await client.auth.getUser();
  const { data: gameData, error: dataError } = await client
    .from(Tables.GAMES_DATA)
    .select("*")
    .eq("id", id)
    .limit(1)
    .single<RawGameData>();

  if (userError || dataError) {
    const e = userError || dataError;
    throw e;
  }

  const missingUser = gameData.users.find((u) => !u.id);
  const isCurrentUser = gameData.users.some((u) => u.id === userData.user.id);

  if (!missingUser) {
    // if both users are defined, check if some of users is current user, and do nothing
    if (!isCurrentUser) {
      throw new Error("Sorry, this game is already full");
    }
  } else {
    if (!isCurrentUser) {
      // false = we assume another user can join game
      const newUsers = gameData.users.map((u) => ({ ...u, id: u.id ? u.id : userData.user.id }));
      const { data: rawGameData, error: updateError } = await client
        .from(Tables.GAMES_DATA)
        .update({ users: newUsers })
        .eq("id", id)
        .select("*")
        .returns<RawGameData[]>();

      if (updateError) throw updateError;

      return <ChessLayout rawData={rawGameData[0]!} userId={userData.user.id} />;
    }
  }

  return <ChessLayout rawData={gameData} userId={userData.user.id} />;
}
