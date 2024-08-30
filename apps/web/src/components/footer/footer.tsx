import { Button } from "@ui/components";
import Logo from "@/components/ui/logo";
import { MEDIA_URLS, navigationLinks } from "@/lib/config/urls";
import Link from "next/link";
import { cn } from "@ui/lib";

export default function Footer () {
  return (
    <footer id="footer-root" className="border-t px-5 py-10 relative">
      <div className="container flex sm:flex-col sm:items-start items-center gap-10">
        <Logo />
        <ul className="flex gap-5 sm:gap-2 sm:flex-col w-full">
          {navigationLinks.map((li) => (
            <Link className={cn("text-sm sm:py-2", "link")} key={li.href} href={li.href}>
              {li.label}
            </Link>
          ))}
        </ul>
        <div className="flex gap-4">
          {MEDIA_URLS.map((media) => {
            const Icon = media.icon;
            return (
              <Button variant="ghost" key={media.href} asChild size="icon">
                <a href={media.href}>
                  <Icon className="w-5 h-5 fill-foreground" />
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

