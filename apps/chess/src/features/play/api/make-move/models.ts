import {MOVE} from "@/lib/wasm-to-zod";
import {z} from "zod/v4";

const MAKE_MOVE_REQUEST_BODY = MOVE;

type MakeMoveRequestBody = z.infer<typeof MAKE_MOVE_REQUEST_BODY>;

type MakeMoveResponse = null;

export {
  MAKE_MOVE_REQUEST_BODY,
  type MakeMoveRequestBody,
  type MakeMoveResponse,
};
