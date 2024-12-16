"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Document } from "@/types/document";

export function useRealtimeDocuments(userId: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    async function loadDocuments() {
      try {
        setLoading(true);

        const { data, error } = await supabase.rpc("get_user_documents", {
          current_user_id: userId,
        });

        if (error) throw error;

        setDocuments(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();

    // Suscripción a cambios en tiempo real
    const documentsChannel = supabase
      .channel("documents")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents" },
        (payload) => {
          const { eventType, new: newDoc, old: oldDoc } = payload;

          if (eventType === "INSERT") {
            // Insertar el nuevo documento al inicio de la lista
            setDocuments((prev) => [newDoc as Document, ...prev]);
          } else if (eventType === "UPDATE") {
            // Mover el documento actualizado al inicio de la lista
            setDocuments((prev) => {
              // Filtra el documento actualizado y agrega la versión nueva al inicio
              const updatedList = prev.filter(
                (doc) => doc.id !== (newDoc as Document).id
              );
              return [newDoc as Document, ...updatedList];
            });
          } else if (eventType === "DELETE") {
            // Eliminar el documento de la lista
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

    // Cleanup de la suscripción
    return () => {
      supabase.removeChannel(documentsChannel);
      supabase.removeChannel(collaboratorsChannel);
    };
  }, [userId]);

  return { documents, loading, error };
}
