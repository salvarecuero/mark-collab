import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRealtimeChannel } from "@/hooks/useRealtimeChannel";
import { createClient } from "@/utils/supabase/client";
import { useThrottledCallback } from "./useThrottledCallback";
import { useUser } from "./useUser";
import { useCollaborators } from "./useCollaborators";

export function useCollaborativeDocument(documentId: string) {
  const supabase = createClient();
  const channelName = `document-${documentId}`;

  const sessionId = useRef(crypto.randomUUID());

  const { messages, sendMessage } = useRealtimeChannel(channelName);
  const { collaborators } = useCollaborators(documentId);

  const user = useUser();
  const userIsAuthor = useMemo(() => {
    if (!user) return false;
    return (
      collaborators.find((collaborator) => collaborator.user_id === user?.id)
        ?.permission_level === "author"
    );
  }, [collaborators, user?.id]);

  const chatMessages = messages.filter((message) => message.type === "chat");

  const [localContent, setLocalContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const hasChangesSinceLastSave = useRef(false);

  const saveToDatabase = async () => {
    setIsSaving(true);
    await supabase
      .from("documents")
      .update({ content: localContent, updated_at: new Date().toISOString() })
      .eq("id", documentId);
    hasChangesSinceLastSave.current = false;
    setIsSaving(false);
  };

  const throttledSendUpdate = useThrottledCallback(
    (content: string) => {
      sendMessage({
        type: "edit",
        content,
        timestamp: new Date().toISOString(),
        user_id: user?.id ?? "",
        session_id: sessionId.current,
        user_name: user?.full_name ?? "",
      });
    },
    500,
    true
  );

  const handleLocalChange = (newContent: string) => {
    setLocalContent(newContent);
    hasChangesSinceLastSave.current = true;
    throttledSendUpdate(newContent);
  };

  const handleChatMessage = useCallback(
    (newMessage: string) => {
      sendMessage({
        type: "chat",
        content: newMessage,
        timestamp: new Date().toISOString(),
        user_id: user?.id ?? "",
        session_id: sessionId.current,
        user_name: user?.full_name ?? "",
      });
    },
    [sendMessage, user?.id, sessionId.current, user?.full_name]
  );

  useEffect(() => {
    if (
      messages.length === 0 ||
      messages[messages.length - 1].session_id === sessionId.current
    )
      return;

    if (messages[messages.length - 1].type === "edit")
      setLocalContent(messages[messages.length - 1].content);
  }, [messages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hasChangesSinceLastSave.current) {
        saveToDatabase();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [localContent]);

  useEffect(() => {
    const fetchDocument = async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("content")
        .eq("id", documentId)
        .single();

      if (error) {
        console.error("Error fetching document:", error);
        return;
      }
      setLocalContent(data.content);
    };

    fetchDocument();
  }, [documentId]);

  return {
    localContent,
    handleLocalChange,
    saveToDatabase,
    isSaving,
    hasChangesSinceLastSave: hasChangesSinceLastSave.current,
    handleChatMessage,
    chatMessages,
    collaborators,
    userIsAuthor,
  };
}
