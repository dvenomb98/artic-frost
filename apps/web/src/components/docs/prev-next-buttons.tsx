import { URLS } from "@/lib/config/urls";
import { getDocsFiles, getPrevNext } from "@/lib/utils/mdx-utils";
import { Button } from "@ui/components/ui/button";
import Link from "next/link";
import React, { FC } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PrevNextButtons: FC<{ slug: string }> = async ({ slug }) => {
  const docs = await getDocsFiles();
  const prevNext = getPrevNext(docs, slug);

  return (
    <div className="flex w-full justify-between items-center">
      {prevNext.prev && (
        <Button asChild size={"sm"} variant={"secondary"}>
          <Link href={`${URLS.DOCS}/${prevNext.prev.slug}`} className="flex items-center gap-2">
            <ChevronLeft size={10} />
            {prevNext.prev.title}
          </Link>
        </Button>
      )}
      {prevNext.next && (
        <Button asChild size={"sm"} variant={"secondary"}>
          <Link href={`${URLS.DOCS}/${prevNext.next.slug}`} className="flex items-center gap-2">
            {prevNext.next.title}
            <ChevronRight size={10} />
          </Link>
        </Button>
      )}
    </div>
  );
};

export default PrevNextButtons;
