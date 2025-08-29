import {z} from "zod/v4";

const DELETE_SAVE_REQUEST = z.object({
  id: z.number(),
});

type DeleteSaveResponse = null;
type DeleteSaveRequest = z.infer<typeof DELETE_SAVE_REQUEST>;

export {type DeleteSaveResponse, type DeleteSaveRequest, DELETE_SAVE_REQUEST};
