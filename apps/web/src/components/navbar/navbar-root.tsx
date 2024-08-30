import Logo from "@/components/ui/logo";
import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";
import SearchInput from "./navbar-search";
import DocsMenuNav from "../docs/docs-menu-nav";
import { allDocsResolved} from "@/lib/utils/mdx-utils";
import { ThemeGlobalManager } from "@ui/components";

export default function Navbar() {
  return (
    <div id="navbar-root" className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm">
      <div className="border-b">
        <nav className="container p-3 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Logo />
            <DesktopNav />
          </div>
          <div className="flex items-center gap-4">
            <SearchInput allDocs={allDocsResolved} />
            <ThemeGlobalManager />
            <MobileNav  />
          </div>
        </nav>
      </div>
      <DocsMenuNav />
    </div>
  );
}
