import { ChannelEvent } from "@/hooks/useRealtimeChannel";
import { useState } from "react";
import { DocumentChatItem } from "./DocumentChatitem";

const DocumentChat = ({
  messages,
  onSubmit,
}: {
  messages: ChannelEvent[];
  onSubmit: (message: string) => void;
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === "") return;

    onSubmit(message);
    setMessage("");
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <ol
        className="flex flex-col overflow-y-auto flex-1"
        ref={(el) => el?.scrollTo(0, el.scrollHeight)}
      >
        {messages.map((message) => (
          <DocumentChatItem key={message.timestamp} message={message} />
        ))}
      </ol>

      <form
        className="flex gap-x-2 self-center h-16 items-center"
        onSubmit={handleSubmit}
      >
        <input
          className="text-black pl-1"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-white text-black px-4 py-2 rounded-lg font-bold"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default DocumentChat;
