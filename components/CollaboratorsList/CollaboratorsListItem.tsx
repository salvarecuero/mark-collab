import { removeCollaborator } from "@/actions/collaborator";
import { Collaborator } from "@/types/collaborator";
import { Crown, Pencil, Trash } from "lucide-react";

const CollaboratorsListItem = ({
  collaborator,
  onRemove,
  enableActions,
}: {
  collaborator: Collaborator;
  onRemove: () => void;
  enableActions: boolean;
}) => {
  const isOwner = collaborator.permission_level === "author";

  return (
    <li
      className="flex items-center gap-x-2 border-b border-gray-700 pb-2 last:border-b-0"
      key={collaborator.id}
    >
      <span className="text-white" title={isOwner ? "Author" : "Editor"}>
        {isOwner ? <Crown size={16} /> : <Pencil size={16} />}
      </span>
      <span>{collaborator?.profile?.full_name}</span>
      {enableActions && !isOwner && (
        <button onClick={onRemove} title="Remove collaborator">
          <Trash size={16} />
        </button>
      )}
    </li>
  );
};

export default CollaboratorsListItem;
