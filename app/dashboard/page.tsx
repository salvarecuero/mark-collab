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

    if (document.id) router.push(`/document/${document.id}`);
  };

  return (
    <div className="flex items-center justify-center h-full">
      {loading ? (
        "Loading..."
      ) : (
        <div className="flex flex-col gap-y-5 min-h-fit h-2/3 text-center">
          <h1 className="text-2xl font-bold">Your projects!</h1>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleCreateDocument}
          >
            Create Document
          </button>

          <DocumentList documents={documents} />
        </div>
      )}
    </div>
  );
}
