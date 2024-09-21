import Logo from "@/components/logo";
import { ThemeGlobalManager } from "@ui/components";

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
        </div>
      </nav>
    </div>
  );
}
