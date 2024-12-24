"use client";

import { useCollaborativeDocument } from "@/hooks/useCollaborativeDocument";
import { useParams } from "next/navigation";
import Markdown from "react-markdown";
import "./markdown.css";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import EditorHeaderSection from "@/components/EditorHeaderSection";
import { useCollaboratorSync } from "@/hooks/useCollaboratorSync";

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  const { localContent, handleLocalChange, isSaving, hasChangesSinceLastSave } =
    useCollaborativeDocument(id);
  const { collaborators } = useCollaboratorSync(id);

  return (
    <div className="flex flex-col h-screen">
      <Header
        className="p-3 bg-slate-100 sticky top-0"
        logoClassName="text-black"
      >
        <EditorHeaderSection
          hasChangesSinceLastSave={hasChangesSinceLastSave}
          isSaving={isSaving}
          documentId={id}
          collaborators={collaborators}
        />
      </Header>

      <div className="flex h-[calc(100vh-80px)]">
        <textarea
          className="w-1/2 h-full text-2xl rounded-md p-4 outline-none bg-[#1b1b1f] resize-none text-white font-medium"
          value={localContent}
          onChange={(e) => handleLocalChange(e.target.value)}
          placeholder="Write your markdown here..."
          spellCheck={false}
          autoFocus={true}
        />

        <div className="w-1/2 border-l border-gray-300 bg-[#161618] text-white overflow-y-auto">
          <Markdown className="markdown-viewer" remarkPlugins={[remarkGfm]}>
            {localContent}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
