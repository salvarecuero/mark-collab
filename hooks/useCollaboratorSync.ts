import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Collaborator } from "@/types/collaborator";

export function useCollaboratorSync(documentId: string) {
  const supabase = createClient();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  useEffect(() => {
    if (!documentId) return;

    // Fetch inicial de colaboradores
    const fetchCollaborators = async () => {
      const { data, error } = await supabase
        .from("collaborators")
        .select("*")
        .eq("document_id", documentId);

      if (error) console.error("Error fetching collaborators:", error);
      setCollaborators(data || []);
    };

    fetchCollaborators();

    // Suscripción a cambios en colaboradores
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
        (payload) => {
          if (payload.eventType === "INSERT") {
            setCollaborators((prev) => [...prev, payload.new as Collaborator]);
          } else if (payload.eventType === "DELETE") {
            setCollaborators((prev) =>
              prev.filter((collab) => collab.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            setCollaborators((prev) =>
              prev.map((collab) =>
                collab.id === payload.new.id
                  ? (payload.new as Collaborator)
                  : collab
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(collaboratorChannel);
    };
  }, [documentId]);

  return { collaborators, setCollaborators };
}
