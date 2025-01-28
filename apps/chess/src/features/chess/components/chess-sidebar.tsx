import MovesHistory from "./moves-history";
import Chat from "../modules/chat/components/chat";
import ActionButtons from "./action-buttons";
import { EngineGameInfo } from "./engine-game-info";
import { cn } from "@ui/lib";

export default function ChessSidebar() {
  return (
    <div
      className={cn(
        "p-5 bg-card h-full w-full",
        "flex flex-col gap-6",
        "border lg:border-none"
      )}
    >
      <ActionButtons />
      <EngineGameInfo />
      <div className="flex-grow flex flex-col overflow-hidden gap-6">
        <div className="h-[100px]">
          <MovesHistory />
        </div>
        <div className="overflow-hidden flex-1 lg:max-h-[500px]">
          <Chat />
        </div>
      </div>
    </div>
  );
}
