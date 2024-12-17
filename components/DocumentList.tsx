import { deleteDocument } from "@/actions/document";
import { Document } from "@/types/document";
import Link from "next/link";

const DocumentList = ({ documents }: { documents: Document[] }) => {
  return (
    <ul>
      {documents.map((document) => (
        <li className="flex gap-x-2" key={document.id}>
          <span>{document.created_at}</span>
          <Link href={`/document/${document.id}`}>{document.title}</Link>
          <button onClick={() => deleteDocument(document.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default DocumentList;
