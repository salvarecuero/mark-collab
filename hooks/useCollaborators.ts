import { useEffect, useState } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { Collaborator } from "@/types/collaborator";
import { getDocumentCollaborators } from "@/actions/collaborator";

export const useCollaborators = (documentId: string) => {
  const supabase = createClient();

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  // Initializes the collaborators state with the collaborators from the database
  // and subscribes to a real-time channel to update state when a collaborator is added or removed
  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const collaborators = await getDocumentCollaborators(documentId);
        setCollaborators(collaborators);
      } catch (error) {
        setCollaborators([]);
      }
    };

    fetchCollaborators();

    const channel = supabase.channel(`collaborators-${documentId}`);

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "collaborators",
          filter: `document_id=eq.${documentId}`,
        },
        fetchCollaborators
      )
      .on("broadcast", { event: "collaborator_deleted" }, (payload: any) => {
        if (payload.payload.document_id === documentId) {
          setCollaborators((prev) =>
            prev.filter((c) => c.id !== payload.payload.id)
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId]);

  return { collaborators };
};
