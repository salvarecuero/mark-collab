import { Collaborator } from "@/types/collaborator";
import { AddCollaboratorInput } from "../AddCollaboratorInput";
import { removeCollaborator } from "@/actions/collaborator";
import CollaboratorsListItem from "./CollaboratorsListItem";
const CollaboratorsList = ({
  collaborators,
  documentId,
  enableActions,
}: {
  collaborators: Collaborator[];
  documentId: string;
  enableActions: boolean;
}) => {
  return (
    <div className="flex flex-col gap-y-10">
      {enableActions && <AddCollaboratorInput documentId={documentId} />}
      <ul className="flex flex-col gap-y-2">
        {collaborators.map((collaborator) => (
          <CollaboratorsListItem
            key={collaborator.id}
            collaborator={collaborator}
            onRemove={() => removeCollaborator(documentId, collaborator.id)}
            enableActions={enableActions}
          />
        ))}
      </ul>
    </div>
  );
};

export default CollaboratorsList;
