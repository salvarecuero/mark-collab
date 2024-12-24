const CollaboratorAvatar = ({
  circleName,
  fullName,
  isOwner,
  enableActions = false,
  onRemove,
}: {
  circleName: string;
  fullName?: string;
  isOwner?: boolean;
  enableActions?: boolean;
  onRemove?: () => void;
}) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
  ];

  const randomColor =
    colors[Math.floor(Math.abs(circleName.charCodeAt(0)) % colors.length)];

  return (
    <div className="group relative">
      <button
        className={`rounded-full ${randomColor} text-white w-[32px] h-[32px] leading-none font-bold text-lg flex items-center justify-center hover:cursor-pointer hover:opacity-80`}
        title={`${fullName}${isOwner ? " (Owner)" : ""}`}
      >
        {circleName}
      </button>

      {enableActions && !isOwner && (
        <button
          onClick={onRemove}
          className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          title="Remove collaborator"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default CollaboratorAvatar;
