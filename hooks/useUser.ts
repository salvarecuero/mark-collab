import { API_ROUTES } from "@/constants/routes";
import { UserMetadata } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<UserMetadata | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(API_ROUTES.USER.CURRENT);

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();
      setUser(data);
    }

    fetchUser();
  }, []);

  return user;
};
