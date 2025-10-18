import {TAGS_VALUES} from "@/lib/translations";
import {DbSavesTableRow} from "@/services/supabase/types";
import {z} from "zod/v4";

const EDIT_POSITION_REQUEST = z.object({
  title: z.string().max(20, "Title must be less than 20 characters").optional(),
  id: z.number(),
  tags: z.array(z.enum(TAGS_VALUES)).optional(),
});

type EditPositionResponse = DbSavesTableRow;
type EditPositionRequest = z.infer<typeof EDIT_POSITION_REQUEST>;

export {
  type EditPositionResponse,
  type EditPositionRequest,
  EDIT_POSITION_REQUEST,
};
