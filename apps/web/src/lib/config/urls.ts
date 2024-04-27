import { GithubIcon, LinkedinIcon } from "lucide-react";

export enum URLS {
  HOMEPAGE = "/",
  DOCS = "/docs",
}

export const navigationLinks = [
  { href: URLS.HOMEPAGE, label: "Home" },
  { href: URLS.DOCS, label: "Docs" },
];

export const MEDIA_URLS = [
  {
    href: "https://github.com/dvenomb98",
    icon: GithubIcon,
  },
  { href: "https://www.linkedin.com/in/daniel-b%C3%ADlek-6177b0249/", icon: LinkedinIcon },
];
