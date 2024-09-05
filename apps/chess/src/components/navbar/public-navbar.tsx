import Logo from "@/components/ui/logo";
import { ThemeGlobalManager } from "@ui/components";
import LogoutButton from "./logout-button";

export default function PublicNavbar() {
  return (
    <div
      id="navbar-root"
      className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm"
    >
      <nav className="p-2 flex items-center justify-between container">
        <Logo />

        <div className="flex items-center gap-4">
          <ThemeGlobalManager />
          <LogoutButton />
        </div>
      </nav>
    </div>
  );
}
