import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ClientUserService } from "@/services/supabase/api/client/user";

function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      try {
        const userData = await ClientUserService.getUserData();

        setUser(userData);
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

  return { user, loading };
}

export { useUser };
