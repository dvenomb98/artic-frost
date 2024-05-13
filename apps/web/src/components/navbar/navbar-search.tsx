"use client";
import { Button } from "@repo/ui/components/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList, 
} from "@repo/ui/components/command";
import { URLS, navigationLinks } from "@/lib/config/urls";
import { FileIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdxFileWithoutContent } from "@/lib/types/docs";

export default function SearchInput({ allDocs }: { allDocs: MdxFileWithoutContent[] }) {
  const [open, setOpen] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (url: string, baseUrl?: URLS) => {
    setOpen(false);
    if (!!baseUrl) push(`${baseUrl}/${url}`);
    else push(url);
  };

  return (
    <>
      <Button
        variant="outline"
        className="gap-4 text-muted-foreground hover:text-foreground sm:hidden justify-between lg:w-[200px]"
        onClick={() => setOpen(true)}
      >
        <span className="small">Search...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 text-[10px] sm:hidden">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <Button variant="ghost" className="lg:hidden" onClick={() => setOpen(true)}>
        <SearchIcon className="w-4 h-4" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type to search articles" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {navigationLinks.map((li) => (
              <CommandItem key={li.href} onSelect={() => handleSelect(li.href)}>
                <FileIcon className="mr-2 h-4 w-4" />
                <span>{li.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Docs">
            {allDocs.map((li) => (
              <CommandItem key={li.title} onSelect={() => handleSelect(li.fileName, URLS.DOCS)}>
                <FileIcon className="mr-2 h-4 w-4" />
                <span>{li.as}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
