import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { ENGINE_DIFFICULTY_SCHEMA } from "../models";

/*
 *
 * GAMES_DATA_TABLE
 *
 */
const GAME_STATE_SCHEMA = z.enum(["CHECKMATE", "DRAW", "SURRENDER"]).nullable();
const GAME_TYPE_SCHEMA = z.enum(["vs", "engine"]);
const STATUS_SCHEMA = z.enum([
  "IN_QUEUE",
  "IN_PROGRESS",
  "FINISHED",
  "CANCELLED",
]);

const CHAT_SCHEMA = z.object({
  userId: z.string(),
  text: z.string(),
  timestamp: z.number(),
});

const SESSION_TYPE_SCHEMA = z.enum(["PUBLIC", "PRIVATE"]);

const HISTORY_SCHEMA = z.array(z.string());

const RAW_GAME_SCHEMA = z.object({
  id: z.number(),
  fen: z.string(),
  created_at: z.string(),
  moves_history: z.string(),
  history: HISTORY_SCHEMA,
  winner_id: z.string().nullable(),
  game_state: GAME_STATE_SCHEMA,
  user_white_id: z.string().nullable(),
  user_black_id: z.string().nullable(),
  chat: z.array(CHAT_SCHEMA),
  type: GAME_TYPE_SCHEMA,
  status: STATUS_SCHEMA,
  session_type: SESSION_TYPE_SCHEMA,
  engine_difficulty: ENGINE_DIFFICULTY_SCHEMA.nullable(),
});

type RawGameSchema = z.infer<typeof RAW_GAME_SCHEMA>;

/*
 *
 *
 *
 */

/*
 *
 * PROFILE_TABLE
 *
 */

const PROFILE_SCHEMA = z.object({
  id: z.string(),
  username: z.string().nullable(),
  full_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
});

type ProfileSchema = z.infer<typeof PROFILE_SCHEMA>;

type ProfileSchemaExtended = ProfileSchema & { isAnonymous: boolean };

/*
 *
 *
 *
 */

/*
 *
 * ADDITIONAL TYPES
 *
 */

type ProvidedClient = SupabaseClient<any, "public", any>;

/*
 *
 *
 *
 */

export {
  RAW_GAME_SCHEMA,
  CHAT_SCHEMA,
  STATUS_SCHEMA,
  GAME_TYPE_SCHEMA,
  HISTORY_SCHEMA,
  SESSION_TYPE_SCHEMA,
  PROFILE_SCHEMA,
  type ProvidedClient,
  type ProfileSchema,
  type ProfileSchemaExtended,
  type RawGameSchema,
};
