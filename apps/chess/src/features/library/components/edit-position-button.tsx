"use client";

import {Form, FormInput, rhf} from "@artic-frost/form";
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

function EditPositionButton({id}: {id: number}) {
  const router = useRouter();

  const {handleEditSave, fen} = useLibraryStore(state => ({
    handleEditSave: state.handleEditSave,
    fen: state.fen,
  }));

  const form = rhf.useForm({
    mode: "onChange",
    resolver: zodResolver(
      z.object({
        title: z.string().nonempty(),
        fen: z.string().nullable(),
      })
    ),
    defaultValues: {
      title: "",
      fen,
    },
  });

  const handleSubmit = form.handleSubmit(async data => {
    await handleEditSave(id, data.title);
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
          <Form {...form} key={fen}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                name="title"
                label="Title"
                description="Title of the save"
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
          </Form>
        </PopoverContent>
      </Popover>
    </Tooltip>
  );
}

export {EditPositionButton};
