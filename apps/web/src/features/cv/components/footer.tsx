import { MEDIA_URLS } from "@/lib/urls";

function Footer() {
  return (
    <footer className="flex justify-between items-center">
      <div className="flex gap-5">
        {MEDIA_URLS.map(({ href, icon }) => {
          const Icon = icon;
          return (
            <a href={href} key={href}>
              <Icon className="size-4 fill-current" />
            </a>
          );
        })}
      </div>
      <p className="text-muted-foreground text-sm">
        @ {new Date().getFullYear()} Daniel Bílek
      </p>
    </footer>
  );
}

export { Footer };
