import {
  GAME_TYPE_SCHEMA,
  RAW_GAME_SCHEMA,
  SESSION_TYPE_SCHEMA,
} from "@/services/supabase/models";

import { z } from "zod";

const MATCH_MAKING_SCHEMA = RAW_GAME_SCHEMA.omit({
  id: true,
  created_at: true,
  status: true,
});

const CONFIG_SCHEMA = z.object({
  type: GAME_TYPE_SCHEMA,
  session_type: SESSION_TYPE_SCHEMA,
});

const SURRENDER_SCHEMA = RAW_GAME_SCHEMA.pick({
  id: true,
  user_white_id: true,
  user_black_id: true,
  status: true
});

export { MATCH_MAKING_SCHEMA, CONFIG_SCHEMA, SURRENDER_SCHEMA };
