export type Document = {
  id: string; // UUID
  title: string;
  content: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  owner_id: string; // UUID (relates to Profile)
  is_public: boolean;
};
