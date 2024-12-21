const EditorHeaderSection = ({
  hasChangesSinceLastSave,
  isSaving,
}: {
  hasChangesSinceLastSave: boolean;
  isSaving: boolean;
}) => {
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
