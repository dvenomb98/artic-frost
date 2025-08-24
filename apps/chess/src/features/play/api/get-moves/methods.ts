import "server-only";

import {createClient} from "@/services/supabase/server";
import {type NextRequest} from "next/server";
import {GET_MOVES_REQUEST_BODY} from "./models";
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
    return createErrorResponse(parsedBody.error, 400);
  }

  const supabase = await createClient();

  const {data, error} = await supabase
    .from("play")
    .select("fen")
    .limit(1)
    .eq("id", id)
    .single();

  if (!data) return createErrorResponse("Game not found.", 404);
  if (error) return createErrorResponse(error, 500);

  const {WasmChess} = await import("wasm-chess");
  
  try {
    const wasmChess = new WasmChess(data.fen);
    const moves = wasmChess.get_moves(parsedBody.data.row, parsedBody.data.col);

    return createSuccessResponse(moves);
  } catch (error) {
    return createErrorResponse(error, 400);
  }
}

export {POST};
