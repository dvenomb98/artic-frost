"use client";

import {useCoreStore} from "@core/store/provider";
import {cn} from "@artic-frost/ui/lib";
import {UI_CONFIG} from "../const";

const DebugInfo = () => {
  const {isDebug, camera} = useCoreStore(state => ({
    isDebug: state.isDebug,
    camera: state.camera,
  }));

  if (!isDebug) return null;

  return (
    <div
      className={cn(
        "rounded-md p-5 w-32 overflow-hidden text-xs space-y-2",
        UI_CONFIG.CLASSNAMES.FLOATING_BACKGROUND,
        UI_CONFIG.CLASSNAMES.UI_BASE_INDEX
      )}>
      <ul className="text-xs">
        <li>
          x:{" "}
          <span className="text-muted-foreground">{camera.x.toFixed(2)}</span>
        </li>
        <hr className="my-1" />
        <li>
          y:{" "}
          <span className="text-muted-foreground">{camera.y.toFixed(2)}</span>
        </li>
        <hr className="my-1" />
        <li>
          scale:{" "}
          <span className="text-muted-foreground">
            {camera.scale.toFixed(2)}
          </span>
        </li>
      </ul>
    </div>
  );
};

export {DebugInfo};
