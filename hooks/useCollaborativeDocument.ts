import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRealtimeChannel } from "@/hooks/useRealtimeChannel";
import { createClient } from "@/lib/utils/supabase/client";
import { useThrottledCallback } from "./useThrottledCallback";
import { useUser } from "./useUser";
import { useCollaborators } from "./useCollaborators";
import { getDocument } from "@/actions/document";

export function useCollaborativeDocument(documentId: string) {
  const supabase = createClient();
  const channelName = `document-${documentId}`;

  // Identifies user session
  const sessionId = useRef(crypto.randomUUID());

  // An event can be an edit, a chat message or a document-saved message
  const { events, sendEvent } = useRealtimeChannel(channelName);
  const { collaborators } = useCollaborators(documentId);
  const [isLoadingFirstTime, setIsLoadingFirstTime] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

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

  const [documentTitle, setDocumentTitle] = useState<string>("");

  const saveToDatabase = async (
    type: "document-saved" | "title-saved",
    content?: string
  ) => {
    const newContent =
      content ?? (type === "document-saved" ? localContent : documentTitle);

    setIsSaving(true);

    await supabase
      .from("documents")
      .update({
        updated_at: new Date().toISOString(),
        ...(type === "title-saved" && { title: newContent }),
        ...(type === "document-saved" && { content: newContent }),
      })
      .eq("id", documentId);

    sendEvent({
      type,
      content: newContent,
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

  const fetchDocument = useCallback(async () => {
    try {
      const document = await getDocument(documentId);
      setLocalContent(document.content);
      setDocumentTitle(document.title);

      setIsLoadingFirstTime(false);
      setHasAccess(true);
    } catch (error) {
      console.log(error);
      setIsLoadingFirstTime(false);
      setHasAccess(false);
    }
  }, [documentId]);

  // Initializes the document content with the content from the database
  useEffect(() => {
    fetchDocument();
  }, [documentId]);

  // Saves the document to the database every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasChangesSinceLastSave.current) {
        saveToDatabase("document-saved");
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

    if (events[events.length - 1].type === "title-saved") {
      setDocumentTitle(events[events.length - 1].content);
    }
  }, [events.length]);

  return {
    localContent,
    documentTitle,
    setDocumentTitle,
    handleLocalChange,
    saveDocument: saveToDatabase,
    isSaving,
    hasChangesSinceLastSave: hasChangesSinceLastSave.current,
    handleChatMessage,
    chatMessages,
    collaborators,
    userIsAuthor,
    hasAccess,
    isLoadingFirstTime,
  };
}
