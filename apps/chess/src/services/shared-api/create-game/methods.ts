import {
  createErrorResponse,
  createSuccessResponse,
} from "@/services/route-handlers/response";
import {createClient} from "@/services/supabase/server";
import {type NextRequest} from "next/server";
import {createWithAuth} from "@/services/route-handlers/hoc/create-with-auth";
import {CREATE_GAME_REQUEST, CreateGameResponse} from "./models";

const POST = createWithAuth(async (request: NextRequest, _context, userId) => {
  const body = await request.json();

  const parsedBody = CREATE_GAME_REQUEST.safeParse(body);

  if (!parsedBody.success) {
    return createErrorResponse(parsedBody.error).badRequest();
  }

  const {color} = parsedBody.data;
  const supabase = await createClient();

  const {WasmChess} = await import("wasm-chess");
  let game: InstanceType<typeof WasmChess>;

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
        [color]: userId,
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
