"use server";

import { initialFen } from "@/chess/lib/fen";
import { redirect } from "next/navigation";
import { createClient } from "../server";
import { initialState } from "@/chess/lib/definitions";
import { Tables } from "../tables";
import crypto from "crypto"

async function createChessGame() {
  const client = createClient();

  const { data: userData, error } = await client.auth.getUser();
  if (error) throw error;

  const typedArray = new Uint8Array(5);
  const randomValues = crypto.getRandomValues(typedArray);
  const id = randomValues.join('')

  const randomNumber = Math.random() < 0.5 ? 0 : 1;

  let data = structuredClone({
    fen: initialFen,
    gameState: initialState.gameState,
    users: initialState.users,
    movesHistory: initialState.movesHistory,
    id
  });

  data.users[randomNumber]!.id = userData.user.id as string;

  const { error: insertError } = await client.from(Tables.GAMES_DATA).insert({ ...data });
  if (insertError) throw insertError;

  redirect(`/play/${id}`);
}

export { createChessGame };
