"use server";

import { initialFen } from "@/chess/lib/fen";
import crypto from "crypto";
import { redirect } from "next/navigation";
import { createClient } from "../server";
import { initialState } from "@/chess/lib/definitions";
import { Tables } from "../tables";

async function createChessGame() {
  "use server";
  const client = createClient();

  const { data: userData, error } = await client.auth.getUser();
  if (error) throw error;

  const id = BigInt("0x" + crypto.randomBytes(8).toString("hex"));
  const randomNumber = Math.random() < 0.5 ? 0 : 1;

  let data = structuredClone({
    fen: initialFen,
    gameState: initialState.gameState,
    users: initialState.users,
    id: id.toString(),
  });

  data.users[randomNumber]!.id = userData.user.id as string;

  const { error: insertError } = await client.from(Tables.GAMES_DATA).insert({ ...data });
  if (insertError) throw insertError;

  redirect(`/play/${id}`);
}

export { createChessGame };
