import {ThemeGlobalManager} from "@artic-frost/ui/components";
import {cn} from "@artic-frost/ui/lib";
import {UI_CONFIG} from "./const";
import {Toolbar} from "./toolbar/toolbar";
import {Menu} from "./menu/menu";
import {NodeTooltip} from "./node-tooltip/node-tooltip";
import {Zoom} from "./zoom/zoom";
import {GridButton} from "./grid/grid-button";
import {DebugButton} from "./debug/debug-button";
import {DebugInfo} from "./debug/debug-info";

function Ui({children}: {children: React.ReactNode}) {
  return (
    <main className="relative flex min-h-svh w-full flex-1 flex-col bg-background">
      {/*
       *
       * Left Top
       *
       */}
      <div
        className={cn(
          "fixed left-2.5 top-2.5 flex items-start gap-2",
          UI_CONFIG.CLASSNAMES.UI_BASE_INDEX
        )}>
        <Toolbar />
      </div>
      {/*
       *
       * Right Top
       *
       */}
      <div
        className={cn(
          "fixed right-2.5 top-2.5 flex items-center justify-center rounded-md",
          UI_CONFIG.CLASSNAMES.FLOATING_BACKGROUND,
          UI_CONFIG.CLASSNAMES.ITEM_PADDING,
          UI_CONFIG.CLASSNAMES.GAP_BETWEEN_ITEMS,
          UI_CONFIG.CLASSNAMES.UI_BASE_INDEX
        )}>
        <ThemeGlobalManager
          buttonVariant="ghost"
          buttonSize={UI_CONFIG.BUTTON_SIZE}
          iconClassName={UI_CONFIG.CLASSNAMES.ICON_SIZE}
        />
        <Menu />
      </div>
      {children}
      {/*
       *
       * Left Bottom
       *
       */}
      <div
        className={cn(
          "fixed left-2.5 bottom-2.5 flex items-center justify-center rounded-md",
          UI_CONFIG.CLASSNAMES.FLOATING_BACKGROUND,
          UI_CONFIG.CLASSNAMES.ITEM_PADDING,
          UI_CONFIG.CLASSNAMES.GAP_BETWEEN_ITEMS,
          UI_CONFIG.CLASSNAMES.UI_BASE_INDEX
        )}>
        <Zoom />
        <GridButton />
        <DebugButton />
      </div>
      {/*
       *
       * Left Bottom 2
       *
       */}
      <div
        className={cn(
          "fixed left-2.5 bottom-20",
          UI_CONFIG.CLASSNAMES.UI_BASE_INDEX
        )}>
        <DebugInfo />
      </div>
      <NodeTooltip />
    </main>
  );
}

export {Ui};
