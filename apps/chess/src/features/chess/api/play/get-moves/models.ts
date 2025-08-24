import {z} from "zod/v4";

const GET_MOVES_REQUEST_BODY = z.object({
  row: z.number().min(0).max(7),
  col: z.number().min(0).max(7),
});

export {GET_MOVES_REQUEST_BODY};
