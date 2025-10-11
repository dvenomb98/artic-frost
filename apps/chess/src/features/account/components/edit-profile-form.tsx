"use client";

import { UI_CONFIG } from "@/lib/ui-config";
import {useUserStore} from "@/services/supabase/user/provider";
import {Form, FormInput, rhf} from "@artic-frost/form";
import {Button} from "@artic-frost/ui/components";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod/v4";

function EditProfileForm() {
  const {profile, editProfile, flags} = useUserStore(state => ({
    profile: state.profile,
    editProfile: state.editProfile,
    flags: state.flags,
  }));

  const form = rhf.useForm({
    mode: "onChange",
    resolver: zodResolver(
      z.object({
        nickname: z
          .string()
          .max(16, "Nickname must be less than 16 characters"),
      })
    ),
    defaultValues: {
      nickname: profile.nickname || "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(editProfile)}
        className="grid gap-4 max-w-56">
        <FormInput
          name="nickname"
          label="Nickname"
          inputProps={{readOnly: flags.disableEditProfile}}
        />
        <Button
          type="submit"
          className="w-20"
          loading={form.formState.isSubmitting}
          disabled={flags.disableEditProfile}
          variant={UI_CONFIG.BUTTON.VARIANT}
          size={UI_CONFIG.BUTTON.SIZE}
          >
          Save
        </Button>
      </form>
    </Form>
  );
}

export {EditProfileForm};
