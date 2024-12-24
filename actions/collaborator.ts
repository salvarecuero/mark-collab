import { API_ROUTES } from "@/constants/routes";
import { Collaborator } from "@/types/collaborator";

export async function getDocumentCollaborators(
  documentId: string
): Promise<Collaborator[]> {
  const url = API_ROUTES.DOCUMENTS.COLLABORATORS.LIST.replace(
    ":id",
    documentId
  );
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function addCollaborator(
  documentId: string,
  email: string,
  permission: "editor" | "author" = "editor"
): Promise<Collaborator> {
  const url = API_ROUTES.DOCUMENTS.COLLABORATORS.ADD.replace(":id", documentId);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, permission }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function removeCollaborator(
  documentId: string,
  collaboratorId: string
): Promise<void> {
  const url = API_ROUTES.DOCUMENTS.COLLABORATORS.REMOVE.replace(
    ":id",
    documentId
  ).replace(":collaboratorId", collaboratorId);

  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
}
