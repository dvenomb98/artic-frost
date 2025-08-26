/*
 *
 * SSR Page, that is responsible for handling game access and joining game
 * todo:
 * - maybe allow spectator?
 * - dont just throw error when game is not found, but show 404 page
 *
 */

import {createClient} from "@/services/supabase/server";
import {Play} from "./components/play";
import {DbPlayTableRowPlayerKeys} from "@/services/supabase/types";
import {whoAmI} from "./lib/who-am-i";

async function Page(props: PageProps<"/play/[id]">) {
  const {id} = await props.params;

  const supabase = await createClient();
  const {parse_fen} = await import("wasm-chess");

  const {data: gameData} = await supabase
    .from("play")
    .select()
    .eq("id", id)
    .single()
    .throwOnError();

  const {data: userData, error: userError} = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  const {id: userId} = userData.user;

  const doesGameStarted = gameData.white_player && gameData.black_player;
  const hasAccess =
    gameData.white_player === userId || gameData.black_player === userId;

  // 1. If one of the players is the user, return the game
  if (hasAccess) {
    const currentPlayer = whoAmI(gameData, userData.user);
    const parsedFen = parse_fen(gameData.fen);

    return (
      <Play
        initialStoreData={{
          game: gameData,
          currentPlayer: currentPlayer.value,
          parsedFen,
        }}
      />
    );
  }

  // 2. If game started and user is not one of the players
  if (doesGameStarted) {
    // - user should not have access to this game ( todo: maybe allow as spectator ?)
    return <div>Not auth</div>;
  }

  // 3. Game did not started -> check for missing id and update it before joining game
  const shouldBeWhite =
    gameData.white_player && gameData.white_player !== userId;
  const keyToUpdate: DbPlayTableRowPlayerKeys = shouldBeWhite
    ? "white_player"
    : "black_player";
  const {data: updatedGame} = await supabase
    .from("play")
    .update({[keyToUpdate]: userId})
    .eq("id", id)
    .select()
    .single()
    .throwOnError();

  const currentPlayer = whoAmI(updatedGame, userData.user);
  const parsedFen = parse_fen(updatedGame.fen);

  return (
    <Play
      initialStoreData={{
        game: updatedGame,
        parsedFen,
        currentPlayer: currentPlayer.value,
      }}
    />
  );
}

export {Page};
