import { deleteDocument, updateDocument } from "@/actions/document";
import { Document } from "@/types/document";
import DocumentListItem from "./DocumentListItem";
import { useUser } from "@/hooks/useUser";
const DocumentList = ({ documents }: { documents: Document[] }) => {
  const user = useUser();

  const handleSave = async (id: string, title: string) => {
    await updateDocument(id, { title });
  };

  return (
    <ul className="flex flex-col gap-y-2 w-[560px] max-w-full relative">
      {documents.map((document) => (
        <DocumentListItem
          key={document.id}
          isOwner={document.owner_id === user?.id}
          document={document}
          onSave={handleSave}
          onDelete={deleteDocument}
        />
      ))}
    </ul>
  );
};

export default DocumentList;
