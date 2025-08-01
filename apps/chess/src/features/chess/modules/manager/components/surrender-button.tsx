"use client";

import {surrender} from "../services/actions";
import {useChessManager} from "@chess/context/chess-state-manager";
import {Button} from "@artic-frost/ui/components";
import {toast} from "sonner";
import {Flag} from "lucide-react";
import {startTransition, useActionState} from "react";
import {INITIAL_FORM_STATE} from "@/lib/forms/definitions";
import {useActionHandler} from "@/lib/forms";

function SurrenderButton() {
  const {state, dispatch} = useChessManager();

  const [actionState, formAction, pending] = useActionState(async () => {
    const res = await surrender({
      id: state.id,
      status: state.status,
      user_white_id: state.userWhiteId,
      user_black_id: state.userBlackId,
    });

    // QUICK FIX TO UPDATE STATE WHEN SURRENDERING VS ENGINE
    if (state.type === "engine") {
      dispatch({
        type: "UPDATE_STATE",
        payload: {
          ...state,
          status: "FINISHED",
          gameState: "SURRENDER",
          winnerId: "engine",
        },
      });
    }

    return res;
  }, INITIAL_FORM_STATE);

  useActionHandler(actionState);

  return (
    <Button
      loading={pending}
      onClick={() =>
        toast("You should get better, pussy :(", {
          action: (
            <Button
              variant="destructive"
              onClick={() => {
                toast.dismiss();
                startTransition(formAction);
              }}>
              Surrender
            </Button>
          ),
          className: "flex justify-between",
        })
      }
      variant="ghost"
      className="w-full gap-2">
      <Flag />
      <span>Surrender</span>
    </Button>
  );
}

export {SurrenderButton};
