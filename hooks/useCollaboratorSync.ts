import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Collaborator } from "@/types/collaborator";
import { API_ROUTES } from "@/constants/routes";

export function useCollaboratorSync(documentId: string) {
  const supabase = createClient();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!documentId) return;

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

    const collaboratorChannel = supabase
      .channel("collaborator-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "collaborators",
          filter: `document_id=eq.${documentId}`,
        },
        async () => {
          // Refetch collaborators when any change occurs
          await fetchCollaborators();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(collaboratorChannel);
    };
  }, [documentId]);

  return { collaborators, loading };
}
