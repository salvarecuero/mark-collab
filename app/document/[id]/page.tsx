"use client";

import { useCollaborativeDocument } from "@/hooks/useCollaborativeDocument";
import { useParams } from "next/navigation";
import Markdown from "react-markdown";
import "./markdown.css";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import EditorHeaderSection from "@/components/EditorHeaderSection";
import { useState, useEffect } from "react";
import DocumentSidebar from "@/components/DocumentSidebar";

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"chat" | "collaborators">("chat");

  const {
    localContent,
    handleLocalChange,
    isSaving,
    hasChangesSinceLastSave,
    handleChatMessage,
    chatMessages,
    collaborators,
    userIsAuthor,
    saveDocument,
    documentTitle,
    setDocumentTitle,
  } = useCollaborativeDocument(id);

  const handleTitleChange = (newTitle: string) => {
    setDocumentTitle(newTitle);
    saveDocument("title-saved", newTitle);
  };

  useEffect(() => {
    if (documentTitle) {
      document.title = `${documentTitle} - Mark-Collab`;
    }
  }, [documentTitle]);

  return (
    <div className="flex flex-col h-screen">
      <Header
        className="p-5 bg-slate-100 sticky top-0"
        logoClassName="text-black"
      >
        <EditorHeaderSection
          hasChangesSinceLastSave={hasChangesSinceLastSave}
          isSaving={isSaving}
          saveDocument={saveDocument}
          title={documentTitle}
          onTitleChange={handleTitleChange}
          documentId={id as string}
        />
      </Header>

      <div className="flex h-[calc(100vh-80px)]">
        <textarea
          className="flex-1 h-full text-2xl p-4 outline-none bg-[#1b1b1f] resize-none text-white font-medium"
          value={localContent}
          onChange={(e) => handleLocalChange(e.target.value)}
          placeholder="Write your markdown here..."
          spellCheck={false}
          autoFocus={true}
        />

        <div className="w-1/2 border-l border-gray-300 bg-[#161618] text-white overflow-y-auto px-4 py-2">
          <Markdown className="markdown-viewer" remarkPlugins={[remarkGfm]}>
            {localContent}
          </Markdown>
        </div>

        <div className="fixed right-0 top-[80px] h-[calc(100vh-80px)]">
          <DocumentSidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collaborators={collaborators}
            documentId={id}
            handleChatMessage={handleChatMessage}
            chatMessages={chatMessages}
            enableActions={userIsAuthor}
          />
        </div>
      </div>
    </div>
  );
}
