import { useState } from "react";
import { Document } from "@/types/document";
import { DocumentTitle } from "./DocumentTitle";
import { DocumentActions } from "./DocumentActions";
import DocumentDetails from "./DocumentDetails";
import { updateDocument } from "@/actions/document";

interface DocumentListItemProps {
  document: Document;
  onSave: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  isOwner: boolean;
}

const DocumentListItem = ({
  document,
  onSave,
  onDelete,
  isOwner,
}: DocumentListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(document.title);
  const [isPublic, setIsPublic] = useState(document.is_public);

  const handleTogglePublic = async () => {
    try {
      await updateDocument(document.id, { is_public: !isPublic });
      setIsPublic(!isPublic);
    } catch (error) {
      console.error("Failed to toggle document visibility:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setNewTitle(document.title);
  };

  const handleSave = () => {
    onSave(document.id, newTitle);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewTitle(document.title);
  };

  return (
    <li className="flex gap-x-2 justify-between items-center py-1 first:pt-0 border-b-2 rounded-md last:border-b-0 px-1 last:pb-0 h-10 hover:bg-violet-900">
      <DocumentDetails updatedAt={document.updated_at} isOwner={isOwner} />

      <DocumentTitle
        isEditing={isEditing}
        title={document.title}
        newTitle={newTitle}
        documentId={document.id}
        onTitleChange={setNewTitle}
      />

      <DocumentActions
        isEditing={isEditing}
        isPublic={isPublic}
        isOwner={isOwner}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={() => onDelete(document.id)}
        onTogglePublic={handleTogglePublic}
      />
    </li>
  );
};

export default DocumentListItem;
