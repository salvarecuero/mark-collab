"use client";

import { useCollaborativeDocument } from "@/hooks/useCollaborativeDocument";
import { useParams } from "next/navigation";
import Markdown from "react-markdown";
import "./markdown.css";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import EditorHeaderSection from "@/components/EditorHeaderSection";

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  const { localContent, handleLocalChange, isSaving, hasChangesSinceLastSave } =
    useCollaborativeDocument(id);

  return (
    <div className="flex flex-col gap-y-5 h-screen">
      <Header>
        <EditorHeaderSection
          hasChangesSinceLastSave={hasChangesSinceLastSave}
          isSaving={isSaving}
        />
      </Header>

      <div className="flex h-full gap-x-5">
        <textarea
          className="w-1/2 h-full border border-gray-300 rounded-md p-2 outline-none"
          value={localContent}
          onChange={(e) => handleLocalChange(e.target.value)}
          placeholder="Write your document here..."
        />

        <div className="flex flex-1 h-full border-l border-gray-300 p-2">
          <Markdown className="markdown-viewer" remarkPlugins={[remarkGfm]}>
            {localContent}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
