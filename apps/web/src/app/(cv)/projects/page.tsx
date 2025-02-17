import {
  Block,
  BlockContent,
  BlockDescription,
  BlockTitle,
} from "@/features/cv/components/block";
import { PROJECTS_MAP } from "@/features/cv/lib/projects";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@artic-frost/ui/components";
import { slugify } from "@artic-frost/ui/lib";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-20">
      {PROJECTS_MAP.map(({ header, header_description, projects }) => (
        <Block key={header}>
          <BlockTitle id={slugify(header)}>{header}</BlockTitle>
          <BlockDescription>{header_description}</BlockDescription>
          <BlockContent className="flex flex-col gap-4 text-sm">
            <TooltipProvider>
              {projects.map(({ link, role, title, description }) => (
                <Tooltip key={link}>
                  <a href={link} className="group">
                    <TooltipTrigger className="flex w-full justify-between items-center border-b pb-2 group">
                      <p className="group-hover:text-muted-foreground">
                        {title}
                      </p>
                      <p className="text-muted-foreground">{role}</p>
                    </TooltipTrigger>
                  </a>
                  <TooltipContent className="max-w-sm p-5">
                    {description}
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </BlockContent>
        </Block>
      ))}
    </div>
  );
}
