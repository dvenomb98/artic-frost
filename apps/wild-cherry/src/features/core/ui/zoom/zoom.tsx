"use client";

import {Button} from "@artic-frost/ui/components";
import {UI_CONFIG} from "../const";
import {Plus, Minus} from "lucide-react";
import {useCoreStore} from "@core/store/provider";
import {formatZoom} from "../utils";
import {useEngine} from "../../engine/provider";

function Zoom() {
  const {camera} = useCoreStore(state => ({
    camera: state.camera,
  }));

  const engine = useEngine();

  const handleZoomIn = () => {
    engine.getEngine().zoom("in");
  };

  const handleZoomOut = () => {
    engine.getEngine().zoom("out");
  };
  return (
    <div className="flex items-center gap-2">
      <Button
        title="Zoom in"
        variant="ghost"
        size={UI_CONFIG.BUTTON_SIZE}
        onClick={handleZoomIn}>
        <Plus className={UI_CONFIG.CLASSNAMES.ICON_SIZE} />
      </Button>

      <p title="Zoom level" className="min-w-10 text-center text-xs">
        {formatZoom(camera.scale)}
      </p>

      <Button
        title="Zoom out"
        variant="ghost"
        size={UI_CONFIG.BUTTON_SIZE}
        onClick={handleZoomOut}>
        <Minus className={UI_CONFIG.CLASSNAMES.ICON_SIZE} />
      </Button>
    </div>
  );
}

export {Zoom};
