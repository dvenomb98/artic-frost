import {GithubIcon, GlobeLockIcon} from "lucide-react";
import {Button, ThemeGlobalManager} from "@artic-frost/ui/components";

function HeaderLinks() {
  return (
    <div className="flex gap-1">
      <Button variant="ghost" size="icon" asChild>
        <a href="https://danielbilek.com" target="_blank">
          <GlobeLockIcon size={16} />
        </a>
      </Button>
      <ThemeGlobalManager buttonVariant="ghost" />
    </div>
  );
}

export {HeaderLinks};
