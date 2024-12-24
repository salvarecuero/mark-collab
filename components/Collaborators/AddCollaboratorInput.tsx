import { Plus, Check, X } from "lucide-react";
import { useState } from "react";
import { addCollaborator } from "@/actions/collaborator";

interface AddCollaboratorInputProps {
  documentId: string;
  onSuccess?: () => void;
}

export const AddCollaboratorInput = ({
  documentId,
  onSuccess,
}: AddCollaboratorInputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;

    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await addCollaborator(documentId, email.trim());

      handleCancel();
      onSuccess?.();
    } catch (err) {
      setError("Failed to add collaborator");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 hover:bg-black rounded-full transition-colors hover:text-white"
        title="Add collaborator"
      >
        <Plus size={16} />
      </button>
    );
  }

  return (
    <form action={handleSubmit} className="flex items-center gap-2 relative">
      <input
        type="email"
        name="email"
        placeholder="Enter email..."
        className="bg-transparent border-b border-white/20 outline-none px-1 text-sm"
        autoFocus
        disabled={isLoading}
        required
      />

      <button
        type="submit"
        className="p-1 hover:bg-green-600 rounded-md transition-colors disabled:opacity-50 hover:text-white"
        title="Confirm"
        disabled={isLoading}
      >
        <Check size={16} />
      </button>
      <button
        type="button"
        onClick={handleCancel}
        className="p-1 hover:bg-red-600 rounded-md transition-colors disabled:opacity-50 hover:text-white"
        title="Cancel"
        disabled={isLoading}
      >
        <X size={16} />
      </button>

      {error && (
        <span className="text-red-400 text-xs absolute -bottom-4 left-1">
          {error}
        </span>
      )}
    </form>
  );
};
