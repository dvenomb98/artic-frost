import {ROUTES} from "@/lib/routes";
import {createErrorResponse} from "@/services/route-handlers/response";
import {createClient} from "@/services/supabase/server";
import {NextResponse, type NextRequest} from "next/server";
import {WasmChess} from "wasm-chess";

async function POST(request: NextRequest) {
  const supabase = await createClient();

  let game: WasmChess;

  try {
    game = new WasmChess();
  } catch (error) {
    return createErrorResponse(error, 500);
  }

  // TODO: player etc.

  const {data, error: insertError} = await supabase
    .from("play")
    .insert({
      fen: game.to_fen(),
      result: null,
    })
    .select("id")
    .limit(1)
    .single();

  if (insertError) return createErrorResponse(insertError, 500);
  if (!data) return createErrorResponse("Failed to create game.", 500);

  return NextResponse.redirect(new URL(ROUTES.APP.PLAY(data.id), request.url));
}

export {POST};
