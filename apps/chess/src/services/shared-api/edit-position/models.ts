import {z} from "zod/v4";

const EDIT_POSITION_REQUEST = z.object({
  title: z.string(),
  id: z.number(),
});

type EditPositionResponse = null;
type EditPositionRequest = z.infer<typeof EDIT_POSITION_REQUEST>;

export {
  type EditPositionResponse,
  type EditPositionRequest,
  EDIT_POSITION_REQUEST,
};
