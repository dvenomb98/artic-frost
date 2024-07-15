import Logo from "@/components/ui/logo";
import ThemeModeSwitcher from "@repo/ui/components/theme-mode-switcher";
import ThemePalleteSwitcher from "@repo/ui/components/theme-pallete-switcher";

export default function Navbar() {
  return (
    <div id="navbar-root" className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm">
      <div className="border-b">
        <nav className="container p-3 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Logo />
          </div>
          <div className="flex items-center gap-4">
            <ThemeModeSwitcher />
            <ThemePalleteSwitcher />
          </div>
        </nav>
      </div>
    </div>
  );
}
