import { Collaborator } from "@/types/collaborator";
import { ChevronRight } from "lucide-react";
import CollaboratorsList from "./CollaboratorsList";
import DocumentChat from "./DocumentChat";
import { ChannelEvent } from "@/hooks/useRealtimeChannel";

const DocumentSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  setActiveTab,
  collaborators,
  documentId,
  handleChatMessage,
  chatMessages,
  enableActions,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  activeTab: "chat" | "collaborators";
  setActiveTab: (activeTab: "chat" | "collaborators") => void;
  collaborators: Collaborator[];
  documentId: string;
  handleChatMessage: (newMessage: string) => void;
  chatMessages: ChannelEvent[];
  enableActions: boolean;
}) => {
  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`absolute z-10 top-1/2 -translate-y-1/2 bg-white border border-gray-700 rounded-full p-2 hover:bg-gray-200 transition-transform ${isSidebarOpen ? "-left-4" : "rotate-180 -left-8"}`}
      >
        <ChevronRight size={16} className="text-black" />
      </button>

      <div
        className={`
    h-full border-l border-gray-300 bg-[#0f0f11] text-white
    transition-all duration-300 ease-in-out overflow-hidden flex flex-col
    ${isSidebarOpen ? "w-80 translate-x-0" : "w-0 translate-x-full"}
  `}
      >
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 p-2 text-sm ${
              activeTab === "chat" ? "bg-gray-800" : ""
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab("collaborators")}
            className={`flex-1 p-2 text-sm ${
              activeTab === "collaborators" ? "bg-gray-800" : ""
            }`}
          >
            Collaborators
          </button>
        </div>

        <div className="p-2 h-full overflow-y-auto">
          {activeTab === "chat" && (
            <DocumentChat
              messages={chatMessages}
              onSubmit={handleChatMessage}
            />
          )}

          {activeTab === "collaborators" && (
            <CollaboratorsList
              collaborators={collaborators}
              documentId={documentId}
              enableActions={enableActions}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default DocumentSidebar;
