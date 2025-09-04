import {z} from "zod/v4";

const SAVE_POSITION_REQUEST = z.object({
  fen: z.string(),
  title: z.string().max(20, "Title must be less than 20 characters").optional(),
});

type SavePositionResponse = null;
type SavePositionRequest = z.infer<typeof SAVE_POSITION_REQUEST>;

export {
  type SavePositionResponse,
  type SavePositionRequest,
  SAVE_POSITION_REQUEST,
};
