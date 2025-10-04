import {cn} from "@artic-frost/ui/lib";
import {usePlayStore} from "../store/provider";
import {Loader2, Clock} from "lucide-react";
import {
  buttonVariants,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@artic-frost/ui/components";

type PlayerRowProps = {
  type: "current" | "opponent";
};

function PlayerRow({type}: PlayerRowProps) {
  const {opponentConnected, isOnTurn} = usePlayStore(state => ({
    opponentConnected: state.opponentConnected,
    isOnTurn: state.isOnTurn,
  }));

  const displayText = type === "current" ? "You" : "Opponent";
  const shouldShowOnTurn =
    (type === "current" && isOnTurn) || (type === "opponent" && !isOnTurn);

  return (
    <div className="flex items-center justify-between h-full">
      <p className="text-sm font-medium">{displayText}</p>
      <div className="flex items-center gap-2">
        {!opponentConnected && type === "opponent" && <OpponentWaiting />}
        {opponentConnected && shouldShowOnTurn && <OnTurn />}
      </div>
    </div>
  );
}

export {PlayerRow};

function OpponentWaiting() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>Waiting for opponent to join</span>
      <Loader2 className="motion-safe:animate-spin" />
    </div>
  );
}

function OnTurn() {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(buttonVariants({variant: "secondary", size: "icon"}), "motion-safe:animate-pulse")}>
        <Clock />
      </TooltipTrigger>
      <TooltipContent>
        <p>This player is currently on turn</p>
      </TooltipContent>
    </Tooltip>
  );
}
