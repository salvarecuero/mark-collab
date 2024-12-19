import { Pencil, Check, Trash, X } from "lucide-react";

interface DocumentActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export const DocumentActions = ({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: DocumentActionsProps) => {
  if (isEditing) {
    return (
      <div className="flex gap-2">
        <button onClick={onSave} title="Save">
          <Check size={16} />
        </button>
        <button onClick={onCancel} title="Cancel">
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={onEdit} title="Edit">
        <Pencil size={16} />
      </button>
      <button onClick={onDelete} title="Delete">
        <Trash size={16} />
      </button>
    </div>
  );
};
