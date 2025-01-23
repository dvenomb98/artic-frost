import { z } from "zod";

const COMMENT_SCHEMA = z.object({
  text: z.string(),
  gameId: z.string(),
});

export { COMMENT_SCHEMA };
    