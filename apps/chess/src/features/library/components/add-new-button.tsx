"use client";

import {TAGS_OPTIONS} from "@/lib/translations";
import {UI_CONFIG} from "@/lib/ui-config";
import {sharedApiClient} from "@/services/shared-api/client";
import {FormDropdownCheckboxes, FormInput, rhf} from "@artic-frost/form";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@artic-frost/ui/components";

import {TAGS_VALUES} from "@/lib/translations";
import {zodResolver} from "@hookform/resolvers/zod";

import {useRouter} from "next/navigation";

import {z} from "zod/v4";

function AddNewButton() {
  const router = useRouter();

  const form = rhf.useForm({
    mode: "onChange",
    resolver: zodResolver(
      z.object({
        fen: z.string().nonempty(),
        title: z.string(),
        tags: z.array(z.enum(TAGS_VALUES)),
      })
    ),
    defaultValues: {
      fen: "",
      title: "",
      tags: [],
    },
  });

  const handleSubmit = form.handleSubmit(async data => {
    const result = await sharedApiClient.savePosition(data);

    if (result && result.ok) {
      router.refresh();
    }
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={UI_CONFIG.BUTTON.VARIANT} size={UI_CONFIG.BUTTON.SIZE}>
          Add new
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <rhf.FormProvider {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              name="fen"
              inputProps={{placeholder: "Fen"}}
              description="Full Fen string, including side to move, castling rights, en passant square, halfmove clock, and fullmove number."
            />
            <FormInput
              name="title"
              inputProps={{placeholder: "Title of the save"}}
            />
            <FormDropdownCheckboxes
              name="tags"
              placeholder="Add tags"
              options={TAGS_OPTIONS}
            />
            <Button
              loading={form.formState.isSubmitting}
              className="min-w-20"
              variant={UI_CONFIG.BUTTON.VARIANT}
              size={UI_CONFIG.BUTTON.SIZE}
              type="submit">
              Add
            </Button>
          </form>
        </rhf.FormProvider>
      </PopoverContent>
    </Popover>
  );
}

export {AddNewButton};
