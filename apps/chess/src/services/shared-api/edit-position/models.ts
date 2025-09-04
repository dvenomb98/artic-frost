import {DbSavesTableRow} from "@/services/supabase/types";
import {z} from "zod/v4";

const EDIT_POSITION_REQUEST = z.object({
  title: z.string().max(20, "Title must be less than 20 characters"),
  id: z.number(),
});

type EditPositionResponse = DbSavesTableRow;
type EditPositionRequest = z.infer<typeof EDIT_POSITION_REQUEST>;

export {
  type EditPositionResponse,
  type EditPositionRequest,
  EDIT_POSITION_REQUEST,
};
