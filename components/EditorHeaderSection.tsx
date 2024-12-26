import { Save } from "lucide-react";

interface EditorHeaderSectionProps {
  hasChangesSinceLastSave: boolean;
  isSaving: boolean;
  saveDocument: () => void;
}

const EditorHeaderSection = ({
  hasChangesSinceLastSave,
  isSaving,
  saveDocument,
}: EditorHeaderSectionProps) => {
  return (
    <div className="flex gap-x-5 items-center p-2 mx-auto">
      <button onClick={saveDocument} title="Save document">
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
  );
};

export default EditorHeaderSection;
