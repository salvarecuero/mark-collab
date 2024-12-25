import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export interface ChannelEvent {
  type: "edit" | "chat";
  content: string;
  timestamp: string;
  user_id: string;
  session_id: string;
  user_name: string;
}

export function useRealtimeChannel(channelName: string) {
  const supabase = createClient();
  const [messages, setMessages] = useState<ChannelEvent[]>([]);

  useEffect(() => {
    const channel = supabase.channel(channelName);

    channel.on("broadcast", { event: "message" }, (payload) => {
      setMessages((prev) => [...prev, payload.payload]);
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName]);

  const sendMessage = (message: ChannelEvent) => {
    supabase.channel(channelName).send({
      type: "broadcast",
      event: "message",
      payload: message,
    });
  };

  return { messages, sendMessage };
}
