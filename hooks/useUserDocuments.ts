"use client";

import { API_ROUTES } from "@/constants/routes";
import { Document } from "@/types/document";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useUserDocuments(userId: string) {
  const supabase = createClient();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

    const documentsChannel = supabase
      .channel("documents")
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

    const collaboratorsChannel = supabase
      .channel("collaborators")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "collaborators" },
        async (payload) => {
          const {
            eventType,
            new: newCollaboration,
            old: oldCollaboration,
          } = payload;

          if (eventType === "INSERT") {
            const { data: newDoc, error } = await supabase
              .from("documents")
              .select("*")
              .eq("id", newCollaboration.document_id)
              .single();

            if (!error && newDoc) {
              setDocuments((prev) => [...prev, newDoc as Document]);
            }
          } else if (eventType === "DELETE") {
            setDocuments((prev) =>
              prev.filter(
                (doc) => doc.id !== (oldCollaboration as any).document_id
              )
            );
          }
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
