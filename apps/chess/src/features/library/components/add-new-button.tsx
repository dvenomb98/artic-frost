"use client";

import {sharedApiClient} from "@/services/shared-api/client";
import {Form, FormInput, rhf} from "@artic-frost/form";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@artic-frost/ui/components";
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
      })
    ),
    defaultValues: {
      fen: "",
      title: "",
    },
  });

  const handleSubmit = form.handleSubmit(async data => {
    const result = await sharedApiClient.savePosition(data.fen, data.title);

    if (result && result.ok) {
      router.refresh();
    }
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="sm">
          Add new
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              name="fen"
              label="Fen"
              description="Full Fen string, including side to move, castling rights, en passant square, halfmove clock, and fullmove number."
            />
            <FormInput
              name="title"
              label="Title"
              description="Title of the save"
            />
            <Button
              loading={form.formState.isSubmitting}
              className="min-w-20"
              type="submit">
              Add
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}

export {AddNewButton};
