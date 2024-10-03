import MovesHistory from "./moves-history";
import Chat from "./chat";
import ActionButtons from "./action-buttons";
import EngineActions from "./engine-actions";

export default function ChessSidebar() {
  return (
    <div className="p-5 border rounded lg:border-none lg:rounded-none bg-card h-full w-full flex flex-col gap-6">
      <ActionButtons />
      <EngineActions />
      <div className="flex-grow flex flex-col overflow-hidden gap-6">
        <div className="h-[100px]">
          <MovesHistory />
        </div>
        <div className="flex-grow overflow-hidden">
          <Chat />
        </div>
      </div>
    </div>
  );
}
