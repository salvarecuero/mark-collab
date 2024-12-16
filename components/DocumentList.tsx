import { deleteDocument } from "@/app/dashboard/actions";
import { Document } from "@/types/document";

const DocumentList = ({ documents }: { documents: Document[] }) => {
  return (
    <ul>
      {documents.map((document) => (
        <li className="flex gap-x-2" key={document.id}>
          <span>{document.created_at}</span>
          <span>{document.title}</span>
          <button onClick={() => deleteDocument(document.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default DocumentList;
