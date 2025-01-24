import React from "react";

import { createClient } from "@/services/supabase/server";
import { Tables } from "@/services/supabase/tables";
import { parseMoveHistory } from "@/features/chess/api/resolvers";

import ReviewLayout from "./review-layout";
import { RAW_GAME_SCHEMA } from "@/services/supabase/models";

export default async function ReviewPage({
  id,
  analyze = false,
}: {
  id: string;
  analyze?: boolean;
}) {
  const client = await createClient();
  const { data, error } = await client
    .from(Tables.GAMES_DATA)
    .select("movesHistory, gameState, history")
    .eq("id", id)
    .limit(1)
    .single();

  if (error) throw error;

  const schema = RAW_GAME_SCHEMA.pick({
    movesHistory: true,
    history: true,
    gameState: true,
  });

  const parsedData = schema.parse(data);

  if (!parsedData.movesHistory.length)
    throw new Error("This game doesnt have history yet.");

  const parsedHistory = parseMoveHistory(data.movesHistory);
  
  return (
    <ReviewLayout
      history={parsedHistory}
      fenHistory={data.history}
      gameState={data.gameState}
      analyze={analyze}
    />
  );
}
