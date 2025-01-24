import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

const GAME_STATE_SCHEMA = z.enum(["CHECKMATE", "DRAW", "SURRENDER"]).nullable();
const GAME_TYPE_SCHEMA = z.enum(["vs", "engine"]);
const STATUS_SCHEMA = z.enum(["IN_QUEUE", "IN_PROGRESS", "FINISHED"]);
const USER_SCHEMA = z.object({
  role: z.enum(["WHITE", "BLACK"]),
  id: z.string().nullable(),
});
const CHAT_SCHEMA = z.object({
  userId: z.string(),
  text: z.string(),
  timestamp: z.number(),
});

const HISTORY_SCHEMA = z.array(z.string());

const RAW_GAME_SCHEMA = z.object({
  id: z.number(),
  fen: z.string(),
  created_at: z.string(),
  movesHistory: z.string(),
  history: HISTORY_SCHEMA,
  winnerId: z.string().nullable(),
  gameState: GAME_STATE_SCHEMA,
  users: z.array(USER_SCHEMA),
  chat: z.array(CHAT_SCHEMA),
  type: GAME_TYPE_SCHEMA,
  status: STATUS_SCHEMA,
});

const USER_GAMES_SCHEMA = z.object({
  game_id: z.string(),
  user_id: z.string(),
  created_at: z.string(),
  id: z.number(),
});

type ProvidedClient = SupabaseClient<any, "public", any>;


export { RAW_GAME_SCHEMA, USER_GAMES_SCHEMA, STATUS_SCHEMA, HISTORY_SCHEMA, type ProvidedClient };
