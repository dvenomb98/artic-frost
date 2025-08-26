import {createClient} from "@/services/supabase/server";
import {type NextRequest} from "next/server";
import {MAKE_MOVE_REQUEST_BODY, MakeMoveResponse} from "./models";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/services/route-handlers/response";
import type {GameResult} from "wasm-chess";

async function POST(
  request: NextRequest,
  ctx: RouteContext<"/play/[id]/api/make-move">
) {
  const {id} = await ctx.params;
  const body = await request.json();

  const parsedBody = MAKE_MOVE_REQUEST_BODY.safeParse(body);

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

    let game: InstanceType<typeof WasmChess>;
    let result: GameResult | null = null;

    try {
      game = new WasmChess(data.fen);
      game.move_piece(parsedBody.data);
      result = game.get_game_result() || null;
    } catch (error) {
      return createErrorResponse(error).badRequest();
    }

    await supabase
      .from("play")
      .update({
        fen: game.to_fen(),
        result,
      })
      .eq("id", id)
      .throwOnError();

    return createSuccessResponse<MakeMoveResponse>(null);
  } catch (error) {
    return createErrorResponse(error).internalServerError();
  }
}

export {POST};
