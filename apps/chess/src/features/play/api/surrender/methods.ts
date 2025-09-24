import {
  createErrorResponse,
  createSuccessResponse,
} from "@/services/route-handlers/response";
import {createClient} from "@/services/supabase/server";
import {type NextRequest} from "next/server";
import {createWithAuth} from "@/services/route-handlers/hoc/create-with-auth";

import {getPlayers} from "../../lib/get-players";
import {type GameResult} from "wasm-chess";
import {SurrenderResponse} from "./models";

const POST = createWithAuth<RouteContext<"/play/[id]/api/surrender">>(async (_request: NextRequest, ctx, user) => {
  const {id} = await ctx.params;

  const supabase = await createClient();

  try {
    const {data} = await supabase
      .from("play")
      .select("white_player, black_player, result")
      .eq("id", id)
      .single()
      .throwOnError();

    if (data.result) {
      return createErrorResponse("Game already finished").badRequest();
    }

    const players = getPlayers(data, user);

    const result: GameResult =
      players.current.value === "White"
        ? "WhiteResignation"
        : "BlackResignation";

    await supabase
      .from("play")
      .update({
        result,
      })
      .eq("id", id)
      .throwOnError();

    return createSuccessResponse<SurrenderResponse>(null);
  } catch (error) {
    return createErrorResponse(error).internalServerError();
  }
});

export {POST};
