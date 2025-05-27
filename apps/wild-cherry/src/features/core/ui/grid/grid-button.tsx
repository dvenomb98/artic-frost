"use client";

import {UiButton} from "../ui-button";

import {GridIcon} from "lucide-react";
import {UI_CONFIG} from "../const";
import {useCoreStore} from "../../store/provider";
import {useEngine} from "../../engine/provider";

function GridButton() {
  const {isGridVisible, setIsGridVisible} = useCoreStore(state => ({
    isGridVisible: state.isGridVisible,
    setIsGridVisible: state.setIsGridVisible,
  }));

  const engine = useEngine();

  return (
    <UiButton
      variant={isGridVisible ? "secondary" : "ghost"}
      onClick={() => {
        setIsGridVisible(!isGridVisible);
        engine.getEngine().renderMainCanvas();
      }}>
      <GridIcon className={UI_CONFIG.CLASSNAMES.ICON_SIZE} />
    </UiButton>
  );
}

export {GridButton};
