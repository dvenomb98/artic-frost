import { z } from "zod";

const SURRENDER_SCHEMA = z.object({
  gameId: z.number(),
});

export { SURRENDER_SCHEMA };
