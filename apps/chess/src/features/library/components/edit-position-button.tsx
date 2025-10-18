"use client";

import {FormDropdownCheckboxes, FormInput, rhf} from "@artic-frost/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod/v4";
import {Edit} from "lucide-react";

import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@artic-frost/ui/components";
import {useLibraryStore} from "../store/provider";
import {useRouter} from "next/navigation";
import {UI_CONFIG} from "@/lib/ui-config";
import {CopyInput} from "@artic-frost/ui/composed";
import {SAVE_TAGS_OPTIONS, TAGS_VALUES} from "@/lib/translations";

function EditPositionButton({id}: {id: number}) {
  const router = useRouter();

  const {handleEditSave, fen, currentSave} = useLibraryStore(state => ({
    handleEditSave: state.handleEditSave,
    fen: state.fen,
    currentSave: state.currentSave,
  }));

  const form = rhf.useForm({
    mode: "onChange",
    resolver: zodResolver(
      z.object({
        title: z.string(),
        fen: z.string().nullable(),
        tags: z.array(z.enum(TAGS_VALUES)),
      })
    ),
    defaultValues: {
      title: currentSave?.title || "",
      tags: currentSave?.tags || [],
      fen,
    },
  });

  const handleSubmit = form.handleSubmit(async data => {
    await handleEditSave(id, data.title, data.tags);
    router.refresh();
  });

  return (
    <Tooltip>
      <Popover>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant={UI_CONFIG.BUTTON.VARIANT}
              size={UI_CONFIG.BUTTON.ICON_SIZE}>
              <Edit />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Edit provided data about position</TooltipContent>
        <PopoverContent>
          <rhf.FormProvider {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                name="title"
                inputProps={{placeholder: "Title of the save"}}
              />
              <FormDropdownCheckboxes
                name="tags"
                placeholder="Select tags"
                options={SAVE_TAGS_OPTIONS}
              />
              <CopyInput
                label="Fen"
                description="Read only"
                inputProps={{value: fen || ""}}
              />

              <Button
                loading={form.formState.isSubmitting}
                className="min-w-20"
                variant={UI_CONFIG.BUTTON.VARIANT}
                size={UI_CONFIG.BUTTON.SIZE}
                type="submit">
                Edit
              </Button>
            </form>
          </rhf.FormProvider>
        </PopoverContent>
      </Popover>
    </Tooltip>
  );
}

export {EditPositionButton};
