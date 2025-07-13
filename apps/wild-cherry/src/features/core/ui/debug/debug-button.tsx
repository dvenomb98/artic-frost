"use client";

import {useCoreStore} from "../../store/provider";
import {UiButton} from "../ui-button";
import {BugPlay} from "lucide-react";
import {UI_CONFIG} from "../const";

const DebugButton = () => {
  const {isDebug, toggleDebug} = useCoreStore(state => ({
    isDebug: state.isDebug,
    toggleDebug: state.toggleDebug,
  }));

  return (
    <UiButton
      variant={isDebug ? "secondary" : "ghost"}
      onClick={() => {
        toggleDebug();
      }}>
      <BugPlay className={UI_CONFIG.CLASSNAMES.ICON_SIZE} />
    </UiButton>
  );
};

export {DebugButton};
