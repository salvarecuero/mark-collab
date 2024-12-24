import CollaboratorAvatar from "./CollaboratorAvatar";
import { Collaborator } from "@/types/collaborator";

const CollaboratorsList = ({
  collaborators,
}: {
  collaborators: Collaborator[];
}) => {
  const maxCollaboratorsToShow = 3;
  const collaboratorsToShow = collaborators.slice(0, maxCollaboratorsToShow);
  const remainingCollaborators = collaborators.slice(maxCollaboratorsToShow);

  return (
    <ol className="flex gap-x-1">
      {collaboratorsToShow.map((collaborator) => (
        <li key={collaborator.id}>
          <CollaboratorAvatar
            circleName={collaborator.profile.full_name[0]}
            fullName={collaborator.profile.full_name}
          />
        </li>
      ))}

      {!!remainingCollaborators.length && (
        <li className="group relative">
          <CollaboratorAvatar
            circleName={`+${remainingCollaborators.length}`}
          />

          <div className="absolute left-0 mt-2 bg-gray-900 text-white text-sm rounded p-2 invisible group-hover:visible whitespace-nowrap z-10">
            {remainingCollaborators.map((c) => c.profile.full_name).join(", ")}
          </div>
        </li>
      )}
    </ol>
  );
};

export default CollaboratorsList;
