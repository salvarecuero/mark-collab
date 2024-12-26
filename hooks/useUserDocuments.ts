"use client";

import { API_ROUTES } from "@/constants/routes";
import { Document } from "@/types/document";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { Collaborator } from "@/types/collaborator";

export function useUserDocuments(userId: string) {
  const supabase = createClient();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initializes the documents state with the documents from the database
  useEffect(() => {
    if (!userId) return;

    async function loadDocuments() {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_ROUTES.USER.DOCUMENTS}?userId=${userId}`
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        const data = await response.json();
        setDocuments(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();

    // Subscribes to the real-time channel to update the documents state when a document is added or updated
    const documentsChannel = supabase
      .channel(`documents-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents" },
        (payload) => {
          const { eventType, new: newDoc, old: oldDoc } = payload;

          if (eventType === "INSERT") {
            setDocuments((prev) => [newDoc as Document, ...prev]);
          } else if (eventType === "UPDATE") {
            setDocuments((prev) => {
              const updatedList = prev.filter(
                (doc) => doc.id !== (newDoc as Document).id
              );

              return [newDoc as Document, ...updatedList];
            });
          } else if (eventType === "DELETE") {
            setDocuments((prev) =>
              prev.filter((doc) => doc.id !== (oldDoc as any).id)
            );
          }
        }
      )
      .subscribe();

    // Subscribes to the real-time channel to update the documents when user is added or removed from a document
    const collaboratorsChannel = supabase
      .channel(`collaborators-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "collaborators" },
        async (payload) => {
          const { eventType, new: newCollaboration } = payload;

          // If the user is the author, do not update the documents state
          // because documentsChannel is subscribed to the documents table
          if ((newCollaboration as Collaborator).permission_level === "author")
            return;

          if (eventType === "INSERT") {
            const { data: newDoc, error } = await supabase
              .from("documents")
              .select("*")
              .eq("id", newCollaboration.document_id)
              .single();

            if (!error && newDoc) {
              setDocuments((prev) => [newDoc as Document, ...prev]);
            }
          } else if (eventType === "DELETE") loadDocuments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(documentsChannel);
      supabase.removeChannel(collaboratorsChannel);
    };
  }, [userId]);

  return { documents, loading, error };
}
