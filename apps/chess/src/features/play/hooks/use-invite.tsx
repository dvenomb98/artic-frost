import {useDialogStore} from "@/services/dialog/dialog-provider";
import {usePlayStore} from "../store/provider";
import * as React from "react";
import {InviteDialog} from "../components/invite-dialog";

/**
 * Hook for inviting a player to a game.
 *
 * Opens a dialog to invite a player to a game.
 *
 */
function useInvite() {
  const {openDialog, closeDialog} = useDialogStore(state => ({
    openDialog: state.openDialog,
    closeDialog: state.closeDialog,
  }));

  const {white_player, black_player, gameId} = usePlayStore(state => ({
    white_player: state.game.white_player,
    black_player: state.game.black_player,
    gameId: state.game.id,
  }));

  React.useEffect(() => {
    let id: string | null = null;

    if (!white_player || !black_player) {
      id = openDialog({content: <InviteDialog gameId={gameId} />});
    }

    return () => {
      if (id) {
        closeDialog(id);
      }
    };
  }, [white_player, black_player, openDialog, gameId, closeDialog]);
}

export {useInvite};
