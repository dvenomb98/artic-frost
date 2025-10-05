/*
 *
 * SSR Page, that is responsible for handling game access and joining game
 * todo:
 * - maybe allow spectator?
 * - dont just throw error when game is not found, but show 404 page
 *
 */

import {createClient, getUserId} from "@/services/supabase/server";
import {Play} from "./components/play";
import {DbPlayTableRowPlayerKeys} from "@/services/supabase/types";
import {getPlayers} from "./lib/get-players";
import {doesGameStarted} from "@/lib/play-utils";

async function Page(props: PageProps<"/play/[id]">) {
  const {id} = await props.params;

  const userId = await getUserId();
  const supabase = await createClient();
  const {parse_fen} = await import("wasm-chess");

  const {data: gameData} = await supabase
    .from("play")
    .select()
    .eq("id", id)
    .single()
    .throwOnError();

  const doesStarted = doesGameStarted(gameData);
  const hasAccess =
    gameData.white_player === userId || gameData.black_player === userId;

  // 1. If one of the players is the user, return the game
  if (hasAccess) {
    const players = getPlayers(gameData, userId);
    const parsedFen = parse_fen(gameData.fen);

    return (
      <Play
        initialStoreData={{
          game: gameData,
          players,
          parsedFen,
        }}
      />
    );
  }

  // 2. If game started and user is not one of the players
  if (doesStarted) {
    // - user should not have access to this game ( todo: maybe allow as spectator ?)
    return <div>Not auth</div>;
  }

  // 3. Game did not started -> check for missing id and update it before joining game
  const shouldBeBlack =
    gameData.white_player && gameData.white_player !== userId;
  const keyToUpdate: DbPlayTableRowPlayerKeys = shouldBeBlack
    ? "black_player"
    : "white_player";
  const {data: updatedGame} = await supabase
    .from("play")
    .update({[keyToUpdate]: userId})
    .eq("id", id)
    .select()
    .single()
    .throwOnError();

  const players = getPlayers(updatedGame, userId);
  const parsedFen = parse_fen(updatedGame.fen);

  return (
    <Play
      initialStoreData={{
        game: updatedGame,
        parsedFen,
        players,
      }}
    />
  );
}

export {Page};
