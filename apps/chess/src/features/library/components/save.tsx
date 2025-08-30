"use client";

import {DbSavesTableRow} from "@/services/supabase/types";
import {
  Button,
  AsyncButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@artic-frost/ui/components";

import {Trash2, Play, Edit} from "lucide-react";
import {libraryClient} from "../api/client";
import {useRouter} from "next/navigation";
import {format} from "@/lib/format";
import {Form} from "@/components/form-fields/form";
import {FormInput} from "@/components/form-fields/input";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod/v4";
import {sharedApiClient} from "@/services/shared-api/client";
import {useLibraryParams} from "../hooks/use-library-params";

function Save({save}: {save: Omit<DbSavesTableRow, "user_id">}) {
  const router = useRouter();
  const {replaceParams} = useLibraryParams();

  const title = save.title ?? `Saved Position #${save.id}`;

  const handleDelete = async () => {
    await libraryClient.deleteSave(save.id);
    router.refresh();
  };

  const handleLoad = () => {
    replaceParams({title, id: save.id, fen: save.fen!});
  };

  return (
    <li className="flex flex-col gap-2">
      <p>{title}</p>
      <div className="space-y-2">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {getFenPreview(save.fen)}
          </p>
          <p className="text-xs text-muted-foreground">
            Saved: {format.date(save.created_at)}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handleLoad}
          size="sm"
          variant="secondary"
          className="min-w-40">
          <Play className="size-4 mr-2" />
          Load
        </Button>
        <EditPositionButton id={save.id} />
        <AsyncButton onClick={handleDelete} variant="destructive" size="iconMd">
          <Trash2 className="size-4" />
        </AsyncButton>
      </div>
    </li>
  );
}

export {Save};

function EditPositionButton({id}: {id: number}) {
  const {replaceParams} = useLibraryParams();

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(
      z.object({
        title: z.string().min(3),
      })
    ),
    defaultValues: {
      title: "",
    },
  });

  const handleSubmit = form.handleSubmit(async data => {
    const result = await sharedApiClient.editPosition(id, data.title);

    if (result && result.ok) {
      replaceParams({title: data.title});
    }
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="iconMd">
          <Edit className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              name="title"
              label="Title"
              description="Title of the save"
            />
            <Button
              loading={form.formState.isSubmitting}
              className="min-w-20"
              type="submit">
              Edit
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}

function getFenPreview(fen: string | null) {
  if (!fen) return "No position data";

  const position = fen.split(" ")[0];
  if (!position) return "Invalid position data";

  const pieces = position.replace(/[0-9/]/g, "");
  return `${pieces.length} pieces on board`;
}
