import { useEffect, useRef, useState } from "react";
import { useRealtimeChannel } from "@/hooks/useRealtimeChannel";
import { createClient } from "@/utils/supabase/client";
import { useThrottledCallback } from "./useThrottledCallback";
import { useUser } from "./useUser";

export function useCollaborativeDocument(documentId: string) {
  const supabase = createClient();
  const channelName = `document-${documentId}`;

  const sessionId = useRef(crypto.randomUUID());

  const { messages, sendMessage } = useRealtimeChannel(channelName);
  const user = useUser();

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
        user_id: user?.id,
        session_id: sessionId.current,
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

  useEffect(() => {
    if (
      messages.length === 0 ||
      messages[messages.length - 1].session_id === sessionId.current
    )
      return;

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
  };
}
