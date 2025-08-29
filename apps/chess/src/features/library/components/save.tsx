"use client";

import {DbSavesTableRow} from "@/services/supabase/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  AsyncButton,
} from "@artic-frost/ui/components";

import {Trash2, Play} from "lucide-react";
import {libraryClient} from "../api/client";
import {useRouter} from "next/navigation";
import {format} from "@/lib/format";
import {ROUTES} from "@/lib/routes";
import {QUERY_PARAMS} from "@/lib/query";

function Save({save}: {save: Omit<DbSavesTableRow, "user_id">}) {
  const router = useRouter();

  const handleDelete = async () => {
    await libraryClient.deleteSave(save.id);
    router.refresh();
  };

  const handleLoad = () => {
    const newParams = new URLSearchParams();
    newParams.set(QUERY_PARAMS.SAVE_ID, save.id.toString());
    newParams.set(QUERY_PARAMS.SAVE_FEN, save.fen!);
    router.replace(`${ROUTES.APP.LIBRARY}?${newParams.toString()}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Saved Position #{save.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {getFenPreview(save.fen)}
          </p>
          <p className="text-xs text-muted-foreground">
            Saved: {format.date(save.created_at)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          onClick={handleLoad}
          size="sm"
          variant="secondary"
          className="min-w-40">
          <Play className="size-4 mr-2" />
          Load
        </Button>
        <AsyncButton onClick={handleDelete} variant="destructive" size="iconMd">
          <Trash2 className="size-4" />
        </AsyncButton>
      </CardFooter>
    </Card>
  );
}

export {Save};

const getFenPreview = (fen: string | null) => {
  if (!fen) return "No position data";

  const position = fen.split(" ")[0];
  if (!position) return "Invalid position data";

  const pieces = position.replace(/[0-9/]/g, "");
  return `${pieces.length} pieces on board`;
};
