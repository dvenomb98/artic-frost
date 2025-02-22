import { useCherryStore } from "@/features/core/providers/store-provider";
import {
  Button,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@artic-frost/ui/components";

import { Undo, Redo } from "lucide-react";

function UndoRedo() {
  const { restoreFromHistory, history, currentHistoryIdx } = useCherryStore(s => s);
  console.log(history, currentHistoryIdx)

  const disabled = history.length === 1
  const disabledPrev = currentHistoryIdx === history.length - 1;
  const disabledNext = currentHistoryIdx === 0;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Undo/Redo</SidebarGroupLabel>
      <SidebarGroupContent className="flex gap-2">
        <Button variant="outline" disabled={disabled || disabledPrev} onClick={() => restoreFromHistory(1)}>
          <Undo size={16} />
        </Button>
        <Button variant="outline" disabled={disabled || disabledNext} onClick={() => restoreFromHistory(-1)}>
          <Redo size={16}  />
        </Button>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
export { UndoRedo };
