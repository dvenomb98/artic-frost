import { ChevronRightIcon } from "lucide-react";

export default function DocsBreadcrumbs ({title}: {title: string}) {
  return (
    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">Docs</div>
      <ChevronRightIcon className="h-4 w-4" />
      <div className="font-medium text-foreground">{title}</div>
    </div>
  );
};


