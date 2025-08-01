import ChessLayout from "@chess/components/chess-layout";
import {createClient} from "@/services/supabase/server";
import {Tables} from "@/services/supabase/tables";
import React from "react";
import {UserService} from "@/services/supabase/api/server/user";
import {RAW_GAME_SCHEMA} from "@/services/supabase/models";
import {
  cancelLastGame,
  updateJoinGameData,
} from "@chess/modules/manager/services/utils";

async function PlayPage(props: {params: Promise<{id: string}>}) {
  const params = await props.params;
  const {id} = params;

  const client = await createClient();
  const userData = await UserService.getUserData();

  const {data: gameData, error: dataError} = await client
    .from(Tables.GAMES_DATA)
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();

  if (dataError) {
    throw dataError;
  }

  const parsedData = RAW_GAME_SCHEMA.parse(gameData);

  const waitingForNewUser =
    parsedData.user_white_id === null || parsedData.user_black_id === null;

  const isCurrentUser =
    parsedData.user_white_id === userData.id ||
    parsedData.user_black_id === userData.id;

  if (!waitingForNewUser) {
    // if both users are defined, check if some of users is current user.
    if (!isCurrentUser) {
      throw new Error("Sorry, this game is already full");
    }
  }

  if (!isCurrentUser) {
    if (parsedData.session_type === "PUBLIC") {
      throw new Error("You can join public games only via matchmaking.");
    }

    await cancelLastGame();
    const updatedData = await updateJoinGameData(parsedData, userData);
    return <ChessLayout rawData={updatedData} userId={userData.id} />;
  }

  return <ChessLayout rawData={parsedData} userId={userData.id} />;
}

export default PlayPage;
