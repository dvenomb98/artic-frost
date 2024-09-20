import React from "react";

import { RawGameData } from "@/services/supabase/definitions";
import { createClient } from "@/services/supabase/server";
import { Tables } from "@/services/supabase/tables";
import { parseMoveHistory } from "@/features/chess/store/helpers";

import ReviewLayout from "./review-layout";

export default async function ReviewPage({ id, analyze = false}: { id: string, analyze?: boolean}) {
  const client = createClient();
  const { data, error } = await client
    .from(Tables.GAMES_DATA)
    .select("movesHistory, gameState, history")
    .eq("id", id)
    .limit(1)
    .single<Pick<RawGameData, "movesHistory" | "history" | "gameState">>();

  if (error) throw error;
  if (!data.movesHistory.length)
    throw new Error("This game doesnt have history yet.");

  const parsedHistory = parseMoveHistory(data.movesHistory);
  return <ReviewLayout history={parsedHistory} fenHistory={data.history} gameState={data.gameState} analyze={analyze} />;
}
