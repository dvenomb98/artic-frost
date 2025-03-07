import {NAVIGATION_LINKS} from "@/lib/urls";
import React from "react";
import {NavbarTitle} from "./navbar-title";
import {ThemeGlobalManager} from "@artic-frost/ui/components";
import {NavbarLink} from "./navbar-link";

function Navbar() {
  return (
    <nav className="space-y-4">
      <div className="flex items-center justify-between">
        <NavbarTitle />
        <ThemeGlobalManager buttonVariant="ghost" />
      </div>
      <ul className="flex items-center gap-4 justify-end">
        {NAVIGATION_LINKS.map(url => (
          <li key={url.href}>
            <NavbarLink href={url.href} label={url.label} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

export {Navbar};
