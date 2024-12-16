import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { UserMetadata } from "@supabase/supabase-js";

export const useUser = () => {
  const [user, setUser] = useState<UserMetadata | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return user;
};
