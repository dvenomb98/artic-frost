import React from "react";

import {createClient} from "@/services/supabase/server";
import {Tables} from "@/services/supabase/tables";
import {parseMoveHistory} from "@chess/api/resolvers";

import ReviewLayout from "./review-layout";
import {RAW_GAME_SCHEMA} from "@/services/supabase/models";

export default async function ReviewPage({
  id,
  analyze = false,
}: {
  id: string;
  analyze?: boolean;
}) {
  const client = await createClient();
  const {data, error} = await client
    .from(Tables.GAMES_DATA)
    .select("moves_history, game_state, history")
    .eq("id", id)
    .limit(1)
    .single();

  if (error) throw error;

  const schema = RAW_GAME_SCHEMA.pick({
    moves_history: true,
    history: true,
    game_state: true,
  });

  const parsedData = schema.parse(data);

  if (!parsedData.moves_history.length)
    throw new Error("This game doesnt have history yet.");

  const parsedHistory = parseMoveHistory(parsedData.moves_history);

  return (
    <ReviewLayout
      history={parsedHistory}
      fenHistory={data.history}
      gameState={data.game_state}
      analyze={analyze}
    />
  );
}
