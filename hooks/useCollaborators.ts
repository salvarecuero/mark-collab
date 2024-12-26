import { useEffect, useState } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { Collaborator } from "@/types/collaborator";
import { API_ROUTES } from "@/constants/routes";

export const useCollaborators = (documentId: string) => {
  const supabase = createClient();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollaborators = async () => {
      const url = API_ROUTES.DOCUMENTS.COLLABORATORS.LIST.replace(
        ":id",
        documentId
      );
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch collaborators");
        const data = await response.json();
        setCollaborators(data);
      } catch (error) {
        console.error("Error fetching collaborators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborators();

    const channel = supabase.channel(`collaborators-${documentId}`);

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "collaborators",
          filter: `document_id=eq.${documentId}`,
        },
        (payload) => {
          console.log("Subscription payload:", payload);
          if (payload.eventType === "DELETE") {
            setCollaborators((prev) =>
              prev.filter((c) => c.id !== payload.old.id)
            );
          } else fetchCollaborators();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId]);

  return { collaborators, loading };
};
