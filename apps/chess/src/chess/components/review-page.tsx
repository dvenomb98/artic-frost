import { RawGameData } from "@/utils/supabase/definitions";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/utils/supabase/tables";
import React from "react";
import { parseMoveHistory } from "../lib/fen";
import ReviewLayout from "./review-layout";

export default async function ReviewPage({ id, analyze = false}: { id: string, analyze: boolean}) {
  const client = createClient();
  const { data, error } = await client
    .from(Tables.GAMES_DATA)
    .select("movesHistory")
    .eq("id", id)
    .limit(1)
    .single<Pick<RawGameData, "movesHistory">>();

  if (error) throw error;
  if (!data.movesHistory.length)
    throw new Error("This game doesnt have history yet.");

  const parsedHistory = parseMoveHistory(data.movesHistory);
  return <ReviewLayout history={parsedHistory} analyze={analyze} />;
}
