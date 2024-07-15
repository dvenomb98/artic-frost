import { Button } from "@repo/ui/components/button";
import Logo from "@/components/ui/logo";
import {GithubIcon, LinkedinIcon} from "lucide-react"

export const MEDIA_URLS = [
  {
    href: "https://github.com/dvenomb98",
    icon: GithubIcon,
  },
  { href: "https://www.linkedin.com/in/daniel-b%C3%ADlek-6177b0249/", icon: LinkedinIcon },
];

export default function Footer () {
  return (
    <footer id="footer-root" className="border-t px-5 py-10 relative">
      <div className="container flex sm:flex-col sm:items-start items-center justify-between gap-10">
        <Logo />
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