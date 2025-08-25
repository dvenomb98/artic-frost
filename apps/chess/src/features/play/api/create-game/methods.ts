import {
  createErrorResponse,
  createSuccessResponse,
} from "@/services/route-handlers/response";
import {createClient} from "@/services/supabase/server";
import {NextResponse, type NextRequest} from "next/server";
import {WasmChess} from "wasm-chess";
import {createWithAuth} from "@/services/route-handlers/hoc/create-with-auth";
import {CREATE_GAME_REQUEST, CreateGameResponse} from "./models";

const POST = createWithAuth(async (request: NextRequest, _context, user) => {
  const body = await request.json();

  const parsedBody = CREATE_GAME_REQUEST.safeParse(body);

  if (!parsedBody.success) {
    return createErrorResponse(parsedBody.error).badRequest();
  }

  const {color} = parsedBody.data;
  const supabase = await createClient();

  let game: WasmChess;

  try {
    game = new WasmChess();
  } catch (error) {
    return createErrorResponse(error).internalServerError();
  }

  try {
    const {data} = await supabase
      .from("play")
      .insert({
        fen: game.to_fen(),
        result: null,
        [color]: user.id,
      })
      .select("id")
      .single()
      .throwOnError();

    return createSuccessResponse<CreateGameResponse>({id: data.id});
  } catch (error) {
    return createErrorResponse(error).internalServerError();
  }
});

export {POST};
