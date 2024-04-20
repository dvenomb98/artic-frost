import React, { FC } from "react";
import Logo from "@/components/ui/logo";
import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";
import SearchInput from "./navbar-search";
import ThemeModeSwitcher from "@repo/ui/components/theme-mode-switcher";
import ThemePalleteSwitcher from "@repo/ui/components/theme-pallete-switcher";
import { getBlogPosts } from "@/lib/utils/mdx-utils";

const Navbar: FC = () => {
  const posts = getBlogPosts()
  return (
    <div className="border-b">
      <nav className="container p-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Logo />
          <DesktopNav />
        </div>
        <div className="flex items-center gap-4">
          <SearchInput posts={posts} />
          <ThemeModeSwitcher />
          <ThemePalleteSwitcher />
          <MobileNav />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
