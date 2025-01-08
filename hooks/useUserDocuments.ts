"use client";

import { API_ROUTES } from "@/constants/routes";
import { Document } from "@/types/document";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { Collaborator } from "@/types/collaborator";

export function useUserDocuments(userId: string) {
  const supabase = createClient();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingFirstTime, setIsLoadingFirstTime] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function loadDocuments() {
      try {
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
        setIsLoadingFirstTime(false);
      }
    }

    loadDocuments();

    // Subscribes to document changes
    const documentsChannel = supabase
      .channel(`documents-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "documents",
          filter: `owner_id=eq.${userId}`,
        },
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
          }
        }
      )
      .on("broadcast", { event: "document_deleted" }, (payload: any) => {
        setDocuments((prev) =>
          prev.filter((doc) => doc.id !== payload.payload.document_id)
        );
      })
      .subscribe();

    // Subscribes to collaborator changes
    const collaboratorsChannel = supabase
      .channel(`collaborators-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "collaborators",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          const { new: newCollaboration } = payload;

          // If the user is the author, do not update the documents state
          // because documentsChannel is subscribed to the documents table
          if ((newCollaboration as Collaborator).permission_level === "author")
            return;

          const { data: newDoc, error } = await supabase
            .from("documents")
            .select("*")
            .eq("id", newCollaboration.document_id)
            .single();

          if (!error && newDoc) {
            setDocuments((prev) => [newDoc as Document, ...prev]);
          }
        }
      )
      // Listen for manual broadcast events when collaborator is removed
      .on("broadcast", { event: "collaborator_deleted" }, (payload: any) => {
        if (payload.payload.user_id === userId) {
          setDocuments((prev) =>
            prev.filter((doc) => doc.id !== payload.payload.document_id)
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(documentsChannel);
      supabase.removeChannel(collaboratorsChannel);
    };
  }, [userId]);

  return { documents, loading: isLoadingFirstTime, error };
}
