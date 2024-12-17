import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Document } from "@/types/document";

export function useDocumentSync(documentId: string) {
  const supabase = createClient();
  const [document, setDocument] = useState<Document | null>(null);

  const updateDocument = async (newContent: string) => {
    const { error } = await supabase
      .from("documents")
      .update({ content: newContent, updated_at: new Date().toISOString() })
      .eq("id", documentId)
      .select("*")
      .single();

    if (error) console.error("Error updating document:", error);
  };

  useEffect(() => {
    if (!documentId) return;

    // Fetch inicial del documento
    const fetchDocument = async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single();

      if (error) {
        console.error("Error fetching document:", error);
        return;
      }
      setDocument(data);
    };

    fetchDocument();

    // Suscripción a cambios en tiempo real
    const documentChannel = supabase
      .channel(`document-${documentId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "documents",
          filter: `id=eq.${documentId}`,
        },
        (payload) => {
          const updatedContent = payload.new.content;

          setDocument((prev) => ({
            ...prev!,
            content: updatedContent, // Actualiza el contenido local
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(documentChannel); // Cleanup al desmontar
    };
  }, [documentId]);

  return { document, updateDocument };
}
