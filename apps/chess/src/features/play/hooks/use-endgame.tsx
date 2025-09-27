import * as React from "react";

import {useDialogStore} from "@/services/dialog/dialog-provider";
import {EndgameDialog} from "../components/endgame-dialog";
import {usePlayStore} from "../store/provider";

/**
 *
 * Hook responsible for displaying endgame dialog.
 *
 */
function useEndgame() {
  const {openDialog, closeDialog} = useDialogStore(state => ({
    openDialog: state.openDialog,
    closeDialog: state.closeDialog,
  }));

  const {result} = usePlayStore(state => ({
    white_player: state.game.white_player,
    black_player: state.game.black_player,
    result: state.game.result,
  }));

  React.useEffect(() => {
    let id: string | null = null;

    if (result) {
      id = openDialog({content: <EndgameDialog result={result} />});
    }

    return () => {
      if (id) {
        closeDialog(id);
      }
    };
  }, [openDialog, result, closeDialog]);
}

export {useEndgame};
