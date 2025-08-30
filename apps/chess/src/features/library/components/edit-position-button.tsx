import {Form, FormInput, rhf} from "@artic-frost/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod/v4";
import {sharedApiClient} from "@/services/shared-api/client";
import {useLibraryParams} from "../hooks/use-library-params";
import {Edit} from "lucide-react";

import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@artic-frost/ui/components";

function EditPositionButton({id}: {id: number}) {
  const {replaceParams} = useLibraryParams();

  const form = rhf.useForm({
    mode: "onChange",
    resolver: zodResolver(
      z.object({
        title: z.string().nonempty(),
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

export {EditPositionButton};
