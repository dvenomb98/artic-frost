import {Inset} from "@/components/inset";
import {UserBadge} from "./components/user-badge";
import {EditProfileForm} from "./components/edit-profile-form";
import {Separator} from "@artic-frost/ui/components";

function Page() {
  return (
    <Inset>
      <div className="grid gap-8">
        <UserBadge />
        <Separator />
        <EditProfileForm />
      </div>
    </Inset>
  );
}

export {Page};
