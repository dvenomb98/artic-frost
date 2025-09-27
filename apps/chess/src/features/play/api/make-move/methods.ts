import {createClient} from "@/services/supabase/server";
import {type NextRequest} from "next/server";
import {MAKE_MOVE_REQUEST_BODY, MakeMoveResponse} from "./models";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/services/route-handlers/response";
import type {GameResult} from "wasm-chess";
import {createWithAuth} from "@/services/route-handlers/hoc/create-with-auth";
import {getPlayers} from "../../lib/get-players";

const POST = createWithAuth<RouteContext<"/play/[id]/api/make-move">>(async (request: NextRequest, ctx, user) => {
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
      .select("fen, result, white_player, black_player")
      .eq("id", id)
      .single()
      .throwOnError();

    if (data.result) {
      return createErrorResponse("Game already finished").badRequest();
    }

    const {WasmChess} = await import("wasm-chess");

    let game: InstanceType<typeof WasmChess>;
    let result: GameResult | null = null;

    try {
      game = new WasmChess(data.fen);

      const players = getPlayers(data, user);

      const isForbiddenEnemyPiece =
        players.current.value === "White"
          ? parsedBody.data.piece.startsWith("Black")
          : parsedBody.data.piece.startsWith("White");

      if (isForbiddenEnemyPiece) {
        return createErrorResponse("Cannot move enemy piece").badRequest();
      }

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
});

export {POST};
