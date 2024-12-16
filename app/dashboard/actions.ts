import { Document } from "@/types/document";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function createDocument(
  title: string,
  content: string,
  userId: string
): Promise<Document> {
  const { data, error } = await supabase
    .from("documents")
    .insert({
      title,
      content,
      owner_id: userId,
      is_public: false,
    })
    .single();

  if (error) {
    console.error("Error creating document:", error);
    throw error;
  }

  return data;
}

export async function updateDocument(
  documentId: string,
  updates: Partial<{ title: string; content: string; is_public: boolean }>
) {
  const supabase = createClient();

  // Obtener el estado actual del documento
  const { data: currentDocument, error: fetchError } = await supabase
    .from("documents")
    .select("is_public")
    .eq("id", documentId)
    .single();

  if (fetchError) {
    console.error("Error fetching document:", fetchError);
    throw fetchError;
  }

  // Actualizar el documento
  const { data, error } = await supabase
    .from("documents")
    .update(updates)
    .eq("id", documentId);

  if (error) {
    console.error("Error updating document:", error);
    throw error;
  }

  // Log opcional para saber si cambió `is_public`
  if (currentDocument?.is_public !== updates.is_public) {
    console.log(
      "Document visibility updated. Collaborators will be managed by the trigger."
    );
  }

  return data;
}

export async function deleteDocument(documentId: string): Promise<void> {
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId);

  if (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}

export async function joinPublicDocument(documentId: string, userId: string) {
  const supabase = createClient();

  // Verificar si el documento es público
  const { data: document, error: documentError } = await supabase
    .from("documents")
    .select("is_public")
    .eq("id", documentId)
    .single();

  if (documentError) {
    console.error("Error fetching document:", documentError);
    throw documentError;
  }

  if (!document?.is_public) {
    throw new Error("This document is not public.");
  }

  // Agregar al usuario como colaborador
  const { data, error } = await supabase.from("collaborators").insert({
    document_id: documentId,
    user_id: userId,
    permission_level: "read", // Por defecto, acceso de solo lectura
  });

  if (error) {
    console.error("Error joining public document:", error);
    throw error;
  }

  return data;
}
