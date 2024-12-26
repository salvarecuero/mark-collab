import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRealtimeChannel } from "@/hooks/useRealtimeChannel";
import { createClient } from "@/lib/utils/supabase/client";
import { useThrottledCallback } from "./useThrottledCallback";
import { useUser } from "./useUser";
import { useCollaborators } from "./useCollaborators";

export function useCollaborativeDocument(documentId: string) {
  const supabase = createClient();
  const channelName = `document-${documentId}`;

  // Identifies user session
  const sessionId = useRef(crypto.randomUUID());

  // An event can be an edit, a chat message or a document-saved message
  const { events, sendEvent } = useRealtimeChannel(channelName);
  const { collaborators } = useCollaborators(documentId);

  const user = useUser();
  const userIsAuthor = useMemo(() => {
    if (!user) return false;

    return !!(
      collaborators.find((collaborator) => collaborator.user_id === user?.id)
        ?.permission_level === "author"
    );
  }, [collaborators, user?.id]);

  const chatMessages = events.filter((event) => event.type === "chat");

  const [localContent, setLocalContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const hasChangesSinceLastSave = useRef(false);

  const saveToDatabase = async () => {
    setIsSaving(true);

    await supabase
      .from("documents")
      .update({ content: localContent, updated_at: new Date().toISOString() })
      .eq("id", documentId);

    // TODO: Send a message to the channel to notify other users that the document has been updated
    sendEvent({
      type: "document-saved",
      content: localContent,
      timestamp: new Date().toISOString(),
      user_id: user?.id ?? "",
      session_id: sessionId.current,
      user_name: user?.full_name ?? "",
    });

    hasChangesSinceLastSave.current = false;
    setIsSaving(false);
  };

  const throttledSendUpdate = useThrottledCallback(
    (content: string) => {
      sendEvent({
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
      sendEvent({
        type: "chat",
        content: newMessage,
        timestamp: new Date().toISOString(),
        user_id: user?.id ?? "",
        session_id: sessionId.current,
        user_name: user?.full_name ?? "",
      });
    },
    [sendEvent, user?.id, sessionId.current, user?.full_name]
  );

  // Initializes the document content with the content from the database
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

  // Saves the document to the database every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasChangesSinceLastSave.current) {
        saveToDatabase();
      }
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [localContent]);

  // Updates the local content with the content from the database
  useEffect(() => {
    if (
      events.length === 0 ||
      events[events.length - 1].session_id === sessionId.current
    )
      return;

    if (events[events.length - 1].type === "edit")
      setLocalContent(events[events.length - 1].content);

    if (events[events.length - 1].type === "document-saved") {
      setLocalContent(events[events.length - 1].content);
      hasChangesSinceLastSave.current = false;
    }
  }, [events.length]);

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
    saveDocument: saveToDatabase,
  };
}
