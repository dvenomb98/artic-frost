"use client";

import {DbPlayTableRowPlayerKeys} from "@/services/supabase/types";
import {Form, FormSelect, rhf} from "@artic-frost/form";
import {useRouter} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod/v4";
import {sharedApiClient} from "@/services/shared-api/client";
import {ROUTES} from "@/lib/routes";
import {Button} from "@artic-frost/ui/components";
import {cn} from "@artic-frost/ui/lib";

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
    <div
      className={cn(
        "space-y-4 flex flex-col items-center justify-center",
        "min-h-[50svh]",
        "bg-dot-white/20 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]"
      )}>
      <h1 className="h1 text-center">
        Prepare for Your Ultimate Chess Experience
      </h1>
      <p className="text-muted-foreground text-center">
        Configure your game settings and start playing
      </p>
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
    </div>
  );
}

export {CreateForm};
