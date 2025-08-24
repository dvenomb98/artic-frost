import {createClient} from "@/services/supabase/server";
import {type NextRequest} from "next/server";
import {MAKE_MOVE_REQUEST_BODY} from "./models";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/services/route-handlers/response";

async function POST(
  request: NextRequest,
  ctx: RouteContext<"/play/[id]/api/make-move">
) {
  const {id} = await ctx.params;
  const body = await request.json();

  const parsedBody = MAKE_MOVE_REQUEST_BODY.safeParse(body);

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

  const game = new WasmChess(data.fen);
  game.move_piece(parsedBody.data);

  const {error: updateError} = await supabase
    .from("play")
    .update({
      fen: game.to_fen(),
    })
    .eq("id", id);

  if (updateError) return createErrorResponse(updateError, 500);

  return createSuccessResponse(null, 200);
}

export {POST};
