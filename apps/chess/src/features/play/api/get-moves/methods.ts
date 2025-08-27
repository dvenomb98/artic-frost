import "server-only";

import {createClient} from "@/services/supabase/server";
import {type NextRequest} from "next/server";
import {GET_MOVES_REQUEST_BODY, GetMovesResponse} from "./models";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/services/route-handlers/response";

async function POST(
  request: NextRequest,
  ctx: RouteContext<"/play/[id]/api/get-moves">
) {
  const {id} = await ctx.params;
  const body = await request.json();

  const parsedBody = GET_MOVES_REQUEST_BODY.safeParse(body);

  if (!parsedBody.success) {
    return createErrorResponse(parsedBody.error).badRequest();
  }

  try {
    const supabase = await createClient();

    const {data} = await supabase
      .from("play")
      .select("fen")
      .eq("id", id)
      .single()
      .throwOnError();

    const {WasmChess} = await import("wasm-chess");

    try {
      const wasmChess = new WasmChess(data.fen);
      const moves = wasmChess.get_moves(
        parsedBody.data.row,
        parsedBody.data.col
      );
      return createSuccessResponse<GetMovesResponse>(moves);
    } catch (error) {
      return createErrorResponse(error).badRequest();
    }
  } catch (error) {
    return createErrorResponse(error).internalServerError();
  }
}

export {POST};
