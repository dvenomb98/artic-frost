import {GithubIcon, LinkedinIcon} from "lucide-react";

enum URLS {
  HOMEPAGE = "/",
  DOCS = "/projects",
}

const NAVIGATION_LINKS = [
  {href: URLS.HOMEPAGE, label: "Home"},
  {href: URLS.DOCS, label: "Projects"},
];

const MEDIA_URLS = [
  {
    href: "https://github.com/dvenomb98",
    icon: GithubIcon,
  },
  {
    href: "https://www.linkedin.com/in/daniel-b%C3%ADlek-6177b0249/",
    icon: LinkedinIcon,
  },
];

export {NAVIGATION_LINKS, MEDIA_URLS, URLS};
