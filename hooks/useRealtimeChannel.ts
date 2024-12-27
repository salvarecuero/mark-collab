import { useEffect, useState } from "react";
import { createClient } from "@/lib/utils/supabase/client";

export interface ChannelEvent {
  type: "edit" | "chat" | "document-saved" | "title-saved";
  content: string;
  timestamp: string;
  user_id: string;
  session_id: string;
  user_name: string;
}

export function useRealtimeChannel(channelName: string) {
  const supabase = createClient();
  const [events, setEvents] = useState<ChannelEvent[]>([]);

  useEffect(() => {
    const channel = supabase.channel(channelName);

    channel.on(
      "broadcast",
      { event: "message" },
      (payload: { payload: ChannelEvent }) => {
        setEvents((prev) => [...prev, payload.payload]);
      }
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName]);

  const sendEvent = (event: ChannelEvent) => {
    supabase.channel(channelName).send({
      type: "broadcast",
      event: "message",
      payload: event,
    });
  };

  return { events, sendEvent };
}
