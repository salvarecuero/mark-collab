"use client";

import DocumentList from "@/components/DocumentList";
import { useRealtimeDocuments } from "@/hooks/useRealtimeDocuments";
import { useUser } from "@/hooks/useUser";
import { createDocument } from "./actions";

export default function Dashboard() {
  const user = useUser();
  const { documents, loading } = useRealtimeDocuments(user?.id || "");

  return (
    <div>
      {loading ? (
        "Loading..."
      ) : (
        <>
          <h1>Dashboard</h1>
          <button
            onClick={() => createDocument("Untitled", "", user?.id || "")}
          >
            Create Document
          </button>
          <DocumentList documents={documents} />
        </>
      )}
    </div>
  );
}
