import { API_ROUTES } from "@/constants/routes";
import { Document } from "@/types/document";

export async function createDocument(
  title: string,
  content: string,
  userId: string
): Promise<Document> {
  const response = await fetch(API_ROUTES.DOCUMENTS.CREATE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function updateDocument(
  documentId: string,
  updates: Partial<Document>
) {
  const url = API_ROUTES.DOCUMENTS.UPDATE.replace(":id", documentId);

  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...updates }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function deleteDocument(documentId: string): Promise<void> {
  const url = API_ROUTES.DOCUMENTS.DELETE.replace(":id", documentId);
  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
}

export async function joinPublicDocument(
  documentId: string,
  userId: string,
  permission: "read" | "write" = "read"
) {
  const url = API_ROUTES.DOCUMENTS.JOIN.replace(":id", documentId);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, permission }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}
