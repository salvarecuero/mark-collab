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
    <div className="flex flex-col h-screen">
      <Header className="p-5 bg-slate-100" logoClassName="text-black">
        <EditorHeaderSection
          hasChangesSinceLastSave={hasChangesSinceLastSave}
          isSaving={isSaving}
        />
      </Header>

      <div className="flex h-full">
        <textarea
          className="w-1/2 h-full text-2xl rounded-md p-4 outline-none bg-[#1b1b1f] resize-none text-white font-medium"
          value={localContent}
          onChange={(e) => handleLocalChange(e.target.value)}
          placeholder="Write your markdown here..."
          spellCheck={false}
          autoFocus={true}
        />

        <div className="flex flex-1 h-full border-l border-gray-300 bg-[#161618] p-4 text-white">
          <Markdown className="markdown-viewer" remarkPlugins={[remarkGfm]}>
            {localContent}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
