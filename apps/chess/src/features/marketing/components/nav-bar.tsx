import {Logo} from "./logo";
import {cn} from "@artic-frost/ui/lib";

function MarketingNavBar() {
  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-md",
        "border-b border-border/40 bg-background/95",
        "supports-[backdrop-filter]:bg-background/60"
      )}>
      <div className="container flex items-center justify-between gap-2 py-4 px-4 md:px-6">
        <Logo />
      </div>
    </nav>
  );
}

export {MarketingNavBar};
