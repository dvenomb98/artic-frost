import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "../client";
import { toast } from "sonner";


function useUser() {
  const client = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      try {
        const { data: userData, error } = await client.auth.getUser();

        if (error) {
          throw error;
        }

        setUser(userData.user);
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

export { useUser }
