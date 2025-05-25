import {Button, TooltipContent} from "@artic-frost/ui/components";

import {PaintBucket, Trash, Minus} from "lucide-react";
import {UI_CONFIG} from "../const";
import {cn} from "@artic-frost/ui/lib";
import {useCoreStore} from "@core/store/provider";
import {CoreNode} from "@core/store/store";
import {useEngine} from "@core/engine/provider";

import {ColorPopover} from "./color-popover";

const TYPES = {
  DELETE: "DELETE",
  CHANGE_FILL: "CHANGE_FILL",
  CHANGE_STROKE: "CHANGE_STROKE",
};

const BUTTONS = [
  {
    type: TYPES.DELETE,
    icon: Trash,
  },
  {
    type: TYPES.CHANGE_FILL,
    icon: PaintBucket,
  },
  {
    type: TYPES.CHANGE_STROKE,
    icon: Minus,
  },
];

function Content({nodes}: {nodes: CoreNode[]}) {
  const {deleteNodes, deleteNode} = useCoreStore(state => state);
  const engine = useEngine();

  const handleDelete = () => {
    if (nodes.length === 1) {
      deleteNode(nodes[0]!.id);
    } else {
      deleteNodes(nodes);
    }

    engine.getEngine().renderMainCanvas();
  };

  return (
    <TooltipContent
      className={cn(
        UI_CONFIG.CLASSNAMES.FLOATING_BACKGROUND,
        UI_CONFIG.CLASSNAMES.ITEM_PADDING,
        UI_CONFIG.CLASSNAMES.GAP_BETWEEN_ITEMS
      )}>
      {BUTTONS.map(button => {
        switch (button.type) {
          case TYPES.CHANGE_FILL:
          case TYPES.CHANGE_STROKE:
            return (
              <ColorPopover key={button.type} nodes={nodes} type={button.type}>
                <Button variant="ghost" size={UI_CONFIG.BUTTON_SIZE}>
                  <button.icon className={UI_CONFIG.CLASSNAMES.ICON_SIZE} />
                </Button>
              </ColorPopover>
            );

          case TYPES.DELETE:
            return (
              <Button
                key={button.type}
                variant="ghost"
                size={UI_CONFIG.BUTTON_SIZE}
                onClick={handleDelete}>
                <button.icon className={UI_CONFIG.CLASSNAMES.ICON_SIZE} />
              </Button>
            );
          default:
            return null;
        }
      })}
    </TooltipContent>
  );
}

export {Content};
