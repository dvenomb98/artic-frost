import {useCherryStore} from "@/features/core/providers/store-provider";
import {
  Button,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@artic-frost/ui/components";

import {Undo, Redo} from "lucide-react";

function UndoRedo() {
  const {restoreFromShapes, shapes, currentHistoryIdx} = useCherryStore(s => s);

  const disabled = !shapes.length;

  const disabledPrev = currentHistoryIdx <= 0;
  const disabledNext = currentHistoryIdx >= shapes.length;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Undo/Redo</SidebarGroupLabel>
      <SidebarGroupContent className="flex gap-2">
        <Button
          variant="outline"
          disabled={disabled || disabledPrev}
          onClick={() => restoreFromShapes(-1)}>
          <Undo size={16} />
        </Button>
        <Button
          variant="outline"
          disabled={disabled || disabledNext}
          onClick={() => restoreFromShapes(1)}>
          <Redo size={16} />
        </Button>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
export {UndoRedo};
