import { Check, Pencil, Save, X } from "lucide-react";
import { DocumentTitle } from "./DocumentList/DocumentTitle";
import { useState, useEffect } from "react";
interface EditorHeaderSectionProps {
  hasChangesSinceLastSave: boolean;
  isSaving: boolean;
  saveDocument: (type: "document-saved" | "title-saved") => void;
  title: string;
  onTitleChange: (newTitle: string) => void;
  documentId: string;
}

const EditorHeaderSection = ({
  hasChangesSinceLastSave,
  isSaving,
  saveDocument,
  title,
  onTitleChange,
  documentId,
}: EditorHeaderSectionProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  const handleSave = () => {
    onTitleChange(editedTitle);
    setIsEditingTitle(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setIsEditingTitle(false);
  };

  return (
    <div className="flex gap-x-5 items-center p-2 justify-center flex-1">
      <div className="flex items-center justify-end gap-x-2 border-r border-gray-300 px-4 w-1/2">
        <DocumentTitle
          isEditing={isEditingTitle}
          title={title}
          newTitle={editedTitle}
          documentId={documentId}
          onTitleChange={setEditedTitle}
          enableRedirection={false}
          className="justify-end"
        />

        {isEditingTitle ? (
          <div className="flex gap-2">
            <button onClick={handleSave} title="Save">
              <Check size={16} />
            </button>
            <button onClick={handleCancel} title="Cancel">
              <X size={16} />
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditingTitle(true)} title="Edit">
            <Pencil size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-x-2 w-1/2">
        <button
          onClick={() => saveDocument("document-saved")}
          title="Save document"
        >
          <Save size={24} />
        </button>

        <span
          className={`font-bold ${hasChangesSinceLastSave || isSaving ? "italic" : ""}`}
        >
          {hasChangesSinceLastSave
            ? "Unsaved changes"
            : isSaving
              ? "Saving..."
              : "Saved"}
        </span>
      </div>
    </div>
  );
};

export default EditorHeaderSection;
