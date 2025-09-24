"use client";

import {useUserStore} from "@/services/supabase/user/provider";
import {Avatar, AvatarFallback} from "@artic-frost/ui/components";

function UserBadge() {
  const {profile, user} = useUserStore(state => ({
    profile: state.profile,
    user: state.user,
  }));

  return (
    <div className="flex items-center gap-2 px-1 py-1.5 text-left">
      <Avatar className="size-16 rounded-lg grayscale">
        {/* <AvatarImage  src={user.avatar} alt={user.name} /> */}
        <AvatarFallback className="rounded-lg">A</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left">
        <span className="truncate font-medium">{profile.nickname}</span>
        {!!user.email && (
          <span className="text-muted-foreground truncate text-sm">
            {user.email}
          </span>
        )}
      </div>
    </div>
  );
}

export {UserBadge};
