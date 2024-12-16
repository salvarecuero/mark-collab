export type Collaborator = {
  id: string; // UUID
  document_id: string; // UUID (relates to Document)
  user_id: string; // UUID (relates to Profile)
  permission_level: "read" | "edit";
  added_at: string; // ISO timestamp
};
