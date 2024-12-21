"use client";

import { createDocument } from "@/actions/document";
import DocumentList from "@/components/DocumentList";
import Spinner from "@/components/Spinner";
import { useUser } from "@/hooks/useUser";
import { useUserDocuments } from "@/hooks/useUserDocuments";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const user = useUser();
  const { documents, loading } = useUserDocuments(user?.id || "");
  const router = useRouter();

  const handleCreateDocument = async () => {
    const document = await createDocument("New document", "", user?.id || "");

    if (document.id) router.push(`/document/${document.id}`);
  };

  return (
    <div className="flex items-center justify-center h-full">
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-y-5 min-h-fit h-2/3 text-center max-w-full px-5">
          <h1 className="text-4xl font-bold">Your projects</h1>

          <button
            className="bg-violet-900 text-white px-4 py-2 rounded-md font-semibold"
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
