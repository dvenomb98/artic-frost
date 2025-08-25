import {GITHUB_REPO_URL, PERSONAL_WEBSITE_URL} from "@/lib/links";

function MarketingFooter() {
  return (
    <footer className="border-t h-96">
      <div className="container pt-10">
        <p className="text-lg font-semibold text-foreground">db/chess ♟️</p>
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
      </div>
    </footer>
  );
}

export {MarketingFooter};
