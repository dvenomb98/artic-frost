import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ClientUserService } from "@/services/supabase/api/client/user";
import { ProfileSchemaExtended } from "@/services/supabase/models";

function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileSchemaExtended | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      try {
        const [userData, userProfile] = await Promise.allSettled([
          ClientUserService.getUserData(),
          ClientUserService.getUserProfile(),
        ]);

        setProfile(
          userProfile.status === "fulfilled" ? userProfile.value : null
        );
        setUser(userData.status === "fulfilled" ? userData.value : null);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Error fetching user data: ${error.message}`);
        } else {
          toast.error("Error fetching user data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, profile, loading };
}

export { useUser };
