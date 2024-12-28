import { Pencil, Check, Trash, X, Eye, EyeOff } from "lucide-react";

interface DocumentActionsProps {
  isEditing: boolean;
  isPublic: boolean;
  isOwner: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onTogglePublic: () => void;
}

export const DocumentActions = ({
  isEditing,
  isPublic,
  isOwner,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onTogglePublic,
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

      {isOwner && (
        <button
          onClick={onTogglePublic}
          title={isPublic ? "Make private" : "Make public"}
        >
          {isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      )}

      {isOwner && (
        <button onClick={onDelete} title="Delete">
          <Trash size={16} />
        </button>
      )}
    </div>
  );
};
