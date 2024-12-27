import { useEffect, useState } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { Collaborator } from "@/types/collaborator";
import { API_ROUTES } from "@/constants/routes";
import { getDocumentCollaborators } from "@/actions/collaborator";

export const useCollaborators = (documentId: string) => {
  const supabase = createClient();

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);

  // Initializes the collaborators state with the collaborators from the database
  // and subscribes to a real-time channel to update state when a collaborator is added or removed
  useEffect(() => {
    const fetchCollaborators = async () => {
      const collaborators = await getDocumentCollaborators(documentId);
      setCollaborators(collaborators);
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
