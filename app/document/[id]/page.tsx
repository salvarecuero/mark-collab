"use client";

import { useCollaborativeDocument } from "@/hooks/useCollaborativeDocument";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  const { localContent, handleLocalChange, isSaving, hasChangesSinceLastSave } =
    useCollaborativeDocument(id);

  return (
    <div className="flex flex-col gap-y-5">
      <span>My Post: {id}</span>
      <span>
        {hasChangesSinceLastSave
          ? "Unsaved changes"
          : isSaving
            ? "Saving..."
            : "Saved"}
      </span>
      <div className="flex flex-col">
        <textarea
          className="w-1/2 h-40 border border-gray-300 rounded-md p-2"
          value={localContent}
          onChange={(e) => handleLocalChange(e.target.value)}
          placeholder="Write your document here..."
        />
      </div>
    </div>
  );
}
