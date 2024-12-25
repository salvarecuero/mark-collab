import { AddCollaboratorInput } from "@/components/AddCollaboratorInput";
import { Collaborator } from "@/types/collaborator";

interface EditorHeaderSectionProps {
  hasChangesSinceLastSave: boolean;
  isSaving: boolean;
  documentId: string;
}

const EditorHeaderSection = ({
  hasChangesSinceLastSave,
  isSaving,
  documentId,
}: EditorHeaderSectionProps) => {
  return (
    <div className="flex gap-x-5 items-center p-2 mx-auto">
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
  );
};

export default EditorHeaderSection;
