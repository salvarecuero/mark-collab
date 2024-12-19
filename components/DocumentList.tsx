import { deleteDocument, updateDocument } from "@/actions/document";
import { Document } from "@/types/document";
import Link from "next/link";
import { useState } from "react";

const DocumentList = ({ documents }: { documents: Document[] }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const handleEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setNewTitle(currentTitle);
  };

  const handleSave = async (id: string) => {
    await updateDocument(id, { title: newTitle });
    setEditingId(null);
    setNewTitle("");
  };

  return (
    <ul>
      {documents.map((document) => (
        <li className="flex gap-x-2" key={document.id}>
          <span>{document.created_at}</span>
          {editingId === document.id ? (
            <div className="flex gap-2">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="border p-1 rounded"
              />
              <button onClick={() => handleSave(document.id)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href={`/document/${document.id}`}>{document.title}</Link>
              <button onClick={() => handleEdit(document.id, document.title)}>
                Edit
              </button>
              <button onClick={() => deleteDocument(document.id)}>
                Delete
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default DocumentList;
