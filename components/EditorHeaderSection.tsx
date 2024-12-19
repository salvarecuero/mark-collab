const EditorHeaderSection = ({
  hasChangesSinceLastSave,
  isSaving,
}: {
  hasChangesSinceLastSave: boolean;
  isSaving: boolean;
}) => {
  return (
    <div className="flex gap-x-5 items-center p-2 bg-gray-100">
      <span
        className={`text-gray-500 font-bold ${hasChangesSinceLastSave || isSaving ? "italic" : ""}`}
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
