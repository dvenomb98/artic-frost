
import dayjs from "dayjs";
import { Badge } from "@ui/components";
import { MdxFileWithoutContent } from "@/lib/types/docs";

interface MdxIntroProps {
  meta: MdxFileWithoutContent
}

export default function MdxIntro ({meta}: MdxIntroProps) {
  return (
    <div className="space-y-5">
      <h1 className="h1 ">{meta.title}</h1>
      <p className="text-xs">
        <span className="text-muted-foreground">Last modified:</span>{" "}
        {dayjs(meta.last_modified || meta.released).format("DD/MM/YYYY")}
      </p>
      <p className="text-muted-foreground max-w-lg">{meta.summary}</p>
      <div className="space-x-2">
        {!!meta?.tags?.length &&
          meta.tags.map((tag) => (
            <Badge size="md" variant="outline" key={tag}>
              {tag}
            </Badge>
          ))}
      </div>
    </div>
  );
};

