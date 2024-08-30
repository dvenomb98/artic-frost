import Logo from "@/components/ui/logo";
import { ThemeGlobalManager } from "@repo/ui/components/theme-global-manager"
import LogoutButton from "./logout-button";

export default function Navbar() {
  return (
    <div id="navbar-root" className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm">
      <div className="border-b">
        <nav className="container p-3 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Logo />
          </div>
          <div className="flex items-center gap-4">
            <ThemeGlobalManager />
            <LogoutButton />
          </div>
        </nav>
      </div>
    </div>
  );
}
