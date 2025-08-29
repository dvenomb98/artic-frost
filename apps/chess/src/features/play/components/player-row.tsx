import {usePlayStore} from "../store/provider";
import {Loader2} from "lucide-react";

type PlayerRowProps = {
  type: "current" | "opponent";
};

function PlayerRow({type}: PlayerRowProps) {
  const {opponentConnected} = usePlayStore(state => ({
    opponentConnected: state.opponentConnected,
  }));

  const displayText = type === "current" ? "You" : "Opponent";

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium">{displayText}</p>
      {!opponentConnected && type === "opponent" && <OpponentWaiting />}
    </div>
  );
}

export {PlayerRow};

function OpponentWaiting() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>Waiting for opponent to join</span>
      <Loader2 className="size-4 motion-safe:animate-spin" />
    </div>
  );
}
