import Link from "next/link";

interface DocumentTitleProps {
  isEditing: boolean;
  title: string;
  newTitle: string;
  documentId: string;
  onTitleChange: (value: string) => void;
}

export const DocumentTitle = ({
  isEditing,
  title,
  newTitle,
  documentId,
  onTitleChange,
}: DocumentTitleProps) => {
  if (isEditing) {
    return (
      <input
        value={newTitle}
        size={newTitle.length}
        onChange={(e) => onTitleChange(e.target.value)}
        className="bg-transparent text-inherit font-inherit p-0 m-0 border-none outline-none max-w-full text-center"
        autoFocus={true}
      />
    );
  }

  return (
    <Link
      className="flex flex-1 justify-center truncate"
      href={`/document/${documentId}`}
    >
      {title}
    </Link>
  );
};
