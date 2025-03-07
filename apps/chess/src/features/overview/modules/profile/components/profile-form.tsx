"use client";
import {ProfileSchema} from "@/services/supabase/models";
import {updateProfileData} from "../actions";

import {useActionState} from "react";
import {INITIAL_FORM_STATE, useActionHandler} from "@/lib/forms";
import {Button, Input, Label} from "@artic-frost/ui/components";

function ProfileForm({profileData}: {profileData: ProfileSchema}) {
  const [formState, formAction, isPending] = useActionState(
    updateProfileData,
    INITIAL_FORM_STATE
  );

  const {handleFormSubmit} = useActionHandler(formState);

  return (
    <form
      onSubmit={event => handleFormSubmit(event, formAction)}
      className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            name="username"
            defaultValue={profileData.username ?? ""}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            type="text"
            name="full_name"
            defaultValue={profileData.full_name ?? ""}
          />
        </div>
      </div>
      <Button type="submit" loading={isPending} className="w-[200px]">
        {isPending ? "Updating..." : "Update"}
      </Button>
    </form>
  );
}

export {ProfileForm};
