import {useCherryStore} from "@/features/core/providers/store-provider";
import {Button} from "@artic-frost/ui/components";
import {cn} from "@artic-frost/ui/lib";

import {Undo, Redo} from "lucide-react";
import {UI_CONFIG} from "../../const";

function UndoRedo() {
  const {restoreFromShapes, shapes, currentHistoryIdx} = useCherryStore(s => s);

  const disabled = !shapes.length;

  const disabledPrev = currentHistoryIdx <= 0;
  const disabledNext = currentHistoryIdx >= shapes.length;

  return (
    <div
      className={cn(
        "flex flex-col rounded-md",
        UI_CONFIG.FLOATING_BACKGROUND,
        UI_CONFIG.ITEM_PADDING,
        UI_CONFIG.GAP_BETWEEN_ITEMS
      )}>
      <Button
        variant="ghost"
        size="iconMd"
        disabled={disabled || disabledPrev}
        onClick={() => restoreFromShapes(-1)}>
        <Undo className={UI_CONFIG.ICON_SIZE} />
      </Button>
      <Button
        variant="ghost"
        size="iconMd"
        disabled={disabled || disabledNext}
        onClick={() => restoreFromShapes(1)}>
        <Redo className={UI_CONFIG.ICON_SIZE} />
      </Button>
    </div>
  );
}
export {UndoRedo};
