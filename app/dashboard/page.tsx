"use client";

import { createDocument } from "@/actions/document";
import DocumentList from "@/components/DocumentList";
import { useUser } from "@/hooks/useUser";
import { useUserDocuments } from "@/hooks/useUserDocuments";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const user = useUser();
  const { documents, loading } = useUserDocuments(user?.id || "");
  const router = useRouter();

  const handleCreateDocument = async () => {
    const document = await createDocument("Untitled", "", user?.id || "");

    router.push(`/document/${document.id}`);
  };

  return (
    <div>
      {loading ? (
        "Loading..."
      ) : (
        <>
          <h1>Dashboard</h1>
          <button onClick={handleCreateDocument}>Create Document</button>
          <DocumentList documents={documents} />
        </>
      )}
    </div>
  );
}
