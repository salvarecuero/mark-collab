import { API_ROUTES } from "@/constants/routes";
import { Profile } from "@/types/profile";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<Profile | null>(null);

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
