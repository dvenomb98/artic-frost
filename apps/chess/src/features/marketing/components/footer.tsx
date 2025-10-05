import {GITHUB_REPO_URL, PERSONAL_WEBSITE_URL} from "@/lib/links";
import {Logo} from "./logo";
import {ROUTES} from "@/lib/routes";
import Link from "next/link";

const LEGAL_DOCS = [
  {
    href: ROUTES.DOCUMENTS.PRIVACY_POLICY,
    label: "Privacy Policy",
  },
  {
    href: ROUTES.DOCUMENTS.TERMS_OF_SERVICE,
    label: "Terms of Service",
  },
] as const;

function MarketingFooter() {
  return (
    <footer className="border-t h-96">
      <div className="container pt-10">
        <Logo />
        <p className="mt-5 text-sm inline-flex gap-2">
          <span>
            Created by{" "}
            <a
              href={PERSONAL_WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline">
              dvenomb98
            </a>
            .
          </span>

          <span className="text-muted-foreground">
            Source code available on{" "}
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline">
              GitHub
            </a>
            .
          </span>
        </p>
        <div className="mt-10 flex gap-2">
          {LEGAL_DOCS.map(({href, label}) => (
            <Link
              className="text-muted-foreground text-sm underline"
              href={href}
              key={href}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

export {MarketingFooter};
