import {Toolbar} from "./toolbar/toolbar";
import {Menu} from "./menu/menu";
import {ThemeGlobalManager} from "@artic-frost/ui/components";
import {cn} from "@artic-frost/ui/lib";
import {UI_CONFIG} from "./const";
import {OptionsBar} from "./toolbar/options/options-bar";

function Ui({children}: {children: React.ReactNode}) {
  return (
    <main className="relative flex min-h-svh w-full flex-1 flex-col bg-background">
      <div className="fixed left-2.5 top-2.5 z-10 flex items-start gap-2">
        <Toolbar />
        <OptionsBar />
      </div>
      <div
        className={cn(
          "fixed right-2.5 top-2.5 z-10 flex items-center justify-center rounded-md",
          UI_CONFIG.FLOATING_BACKGROUND,
          UI_CONFIG.ITEM_PADDING,
          UI_CONFIG.GAP_BETWEEN_ITEMS
        )}>
        <ThemeGlobalManager
          buttonVariant="ghost"
          buttonSize="iconMd"
          iconClassName={UI_CONFIG.ICON_SIZE}
        />
        <Menu />
      </div>
      {children}
    </main>
  );
}

export {Ui};
