import React, { FC } from "react";
import Logo from "@/components/ui/logo";
import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";
import SearchInput from "./navbar-search";
import ThemeModeSwitcher from "@repo/ui/components/theme-mode-switcher";
import ThemePalleteSwitcher from "@repo/ui/components/theme-pallete-switcher";

const Navbar: FC = () => {
  return (
    <div id="navbar-root" className="border-b sticky top-0 z-40 bg-background">
      <nav className="container p-3 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Logo />
          <DesktopNav />
        </div>
        <div className="flex items-center gap-4">
          <SearchInput />
          <ThemeModeSwitcher />
          <ThemePalleteSwitcher />
          <MobileNav />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
