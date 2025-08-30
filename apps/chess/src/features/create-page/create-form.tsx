import {DbPlayTableRowPlayerKeys} from "@/services/supabase/types";
import {Form, FormSelect, rhf} from "@artic-frost/form";
import {useRouter} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod/v4";
import {sharedApiClient} from "@/services/shared-api/client";
import {ROUTES} from "@/lib/routes";
import {Button} from "@artic-frost/ui/components";

const COLOR: DbPlayTableRowPlayerKeys[] = ["white_player", "black_player"];

function CreateForm() {
  const router = useRouter();

  const form = rhf.useForm({
    defaultValues: {
      color: "white_player" as DbPlayTableRowPlayerKeys,
    },
    mode: "onChange",
    resolver: zodResolver(
      z.object({
        color: z.enum(COLOR),
      })
    ),
  });

  const handleSubmit = form.handleSubmit(async data => {
    const result = await sharedApiClient.createGame({color: data.color});

    if (result && result.ok) {
      router.push(ROUTES.APP.PLAY(result.data.id));
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormSelect
          name="color"
          label="Color"
          options={[
            {value: "white_player", label: "White"},
            {value: "black_player", label: "Black"},
          ]}
        />
        <Button
          className="w-[200px] h-[48px]"
          type="submit"
          loading={form.formState.isSubmitting}>
          Play now
        </Button>
      </form>
    </Form>
  );
}

export {CreateForm};
