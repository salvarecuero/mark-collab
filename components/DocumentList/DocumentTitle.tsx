import { cn } from "@/lib/utils";
import Link from "next/link";

interface DocumentTitleProps {
  isEditing: boolean;
  title: string;
  newTitle: string;
  documentId: string;
  onTitleChange: (value: string) => void;
  enableRedirection?: boolean;
  className?: string;
}

export const DocumentTitle = ({
  isEditing,
  title,
  newTitle,
  documentId,
  onTitleChange,
  enableRedirection = true,
  className = "",
}: DocumentTitleProps) => {
  const titleClassName = cn("flex flex-1 justify-center truncate", className);

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

  return enableRedirection ? (
    <Link className={titleClassName} href={`/document/${documentId}`}>
      {title}
    </Link>
  ) : (
    <span className={titleClassName}>{title}</span>
  );
};
