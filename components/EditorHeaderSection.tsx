import { AddCollaboratorInput } from "@/components/Collaborators/AddCollaboratorInput";
import CollaboratorsList from "@/components/Collaborators/CollaboratorsList";
import { Collaborator } from "@/types/collaborator";

interface EditorHeaderSectionProps {
  hasChangesSinceLastSave: boolean;
  isSaving: boolean;
  documentId: string;
  collaborators: Collaborator[];
}

const EditorHeaderSection = ({
  hasChangesSinceLastSave,
  isSaving,
  documentId,
  collaborators = [],
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
      <AddCollaboratorInput documentId={documentId} />

      <CollaboratorsList collaborators={collaborators} />
    </div>
  );
};

export default EditorHeaderSection;
