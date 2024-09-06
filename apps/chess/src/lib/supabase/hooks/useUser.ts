import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "../client";

// TODO: Improve this hook

export default function useUser() {
  const client = createClient();
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: userData, error } = await client.auth.getUser();
        if (error) {
          throw error;
        }
        setUser(userData.user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return user;
}
