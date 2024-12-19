import { useState } from "react";
import { formatDocumentListDate } from "@/lib/utils";
import { Document } from "@/types/document";
import { DocumentTitle } from "./DocumentTitle";
import { DocumentActions } from "./DocumentActions";

interface DocumentListItemProps {
  document: Document;
  onSave: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

const DocumentListItem = ({
  document,
  onSave,
  onDelete,
}: DocumentListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(document.title);

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
    <li className="flex gap-x-2 justify-between border-b-2 pb-2 last:border-b-0 last:pb-0 h-10">
      <span
        className="italic"
        title={`Last updated: ${formatDocumentListDate(document.updated_at, true)}`}
      >
        {formatDocumentListDate(document.updated_at)}
      </span>

      <DocumentTitle
        isEditing={isEditing}
        title={document.title}
        newTitle={newTitle}
        documentId={document.id}
        onTitleChange={setNewTitle}
      />

      <DocumentActions
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={() => onDelete(document.id)}
      />
    </li>
  );
};

export default DocumentListItem;
