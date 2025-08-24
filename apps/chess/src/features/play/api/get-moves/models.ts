import {SQUARE} from "@/lib/wasm-to-zod";
import {z} from "zod/v4";

const GET_MOVES_REQUEST_BODY = SQUARE;

type GetMovesRequestBody = z.infer<typeof GET_MOVES_REQUEST_BODY>;

export {GET_MOVES_REQUEST_BODY, type GetMovesRequestBody};
