import {MEDIA_URLS} from "@/lib/urls";
import {Button} from "@artic-frost/ui/components";

function Footer() {
  return (
    <footer className="flex justify-between items-center">
      <div className="flex gap-5">
        {MEDIA_URLS.map(({href, icon}) => {
          const Icon = icon;
          return (
            <Button asChild key={href} size="icon" variant="ghost">
              <a href={href} target="_blank" rel="noreferrer">
                <Icon className="fill-current" />
              </a>
            </Button>
          );
        })}
      </div>
      <p className="text-muted-foreground text-sm">
        @ {new Date().getFullYear()} Daniel Bílek
      </p>
    </footer>
  );
}

export {Footer};
