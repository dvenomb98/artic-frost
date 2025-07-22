import {GithubIcon, LinkedinIcon} from "lucide-react";

const URLS = {
  HOMEPAGE: "/",
  PROJECTS: "/projects",
  BLOG: "/blog",
} as const;

const NAVIGATION_LINKS = [
  {href: URLS.HOMEPAGE, label: "Home"},
  {href: URLS.PROJECTS, label: "Projects"},
  {href: URLS.BLOG, label: "Blog"},
] as const;

const MEDIA_URLS = [
  {
    href: "https://github.com/dvenomb98",
    icon: GithubIcon,
  },
  {
    href: "https://www.linkedin.com/in/daniel-b%C3%ADlek-6177b0249/",
    icon: LinkedinIcon,
  },
] as const;

export {NAVIGATION_LINKS, MEDIA_URLS, URLS};
