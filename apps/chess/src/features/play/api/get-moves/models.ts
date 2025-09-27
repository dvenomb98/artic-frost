import {SQUARE} from "@/lib/wasm-to-zod";
import type {Moves} from "wasm-chess";
import {z} from "zod/v4";

const GET_MOVES_REQUEST_BODY = SQUARE;

type GetMovesRequestBody = z.infer<typeof GET_MOVES_REQUEST_BODY>;

type GetMovesResponse = Moves;

export {
  GET_MOVES_REQUEST_BODY,
  type GetMovesRequestBody,
  type GetMovesResponse,
};
