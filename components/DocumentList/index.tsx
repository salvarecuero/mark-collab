import { deleteDocument, updateDocument } from "@/actions/document";
import { Document } from "@/types/document";
import DocumentListItem from "./DocumentListItem";

const DocumentList = ({ documents }: { documents: Document[] }) => {
  const handleSave = async (id: string, title: string) => {
    await updateDocument(id, { title });
  };

  return (
    <ul className="flex flex-col gap-y-2 w-[560px]">
      {documents.map((document) => (
        <DocumentListItem
          key={document.id}
          document={document}
          onSave={handleSave}
          onDelete={deleteDocument}
        />
      ))}
    </ul>
  );
};

export default DocumentList;
