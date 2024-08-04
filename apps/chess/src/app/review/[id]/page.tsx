import ReviewLayout from "@/chess/components/review-layout";
import { parseMoveHistory } from "@/chess/lib/fen";
import { RawGameData } from "@/utils/supabase/definitions";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/utils/supabase/tables";
import React from "react";

export default async function ReviewPage({
  params: { id },
}: {
  params: { id: string };
}) {
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

const parsedHistory = parseMoveHistory(data.movesHistory)

  return <ReviewLayout history={parsedHistory} />
}
