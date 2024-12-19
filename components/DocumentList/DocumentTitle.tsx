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
        onChange={(e) => onTitleChange(e.target.value)}
        className="border p-1 rounded max-w-full"
      />
    );
  }

  return (
    <Link className="max-w-full truncate" href={`/document/${documentId}`}>
      {title}
    </Link>
  );
};
