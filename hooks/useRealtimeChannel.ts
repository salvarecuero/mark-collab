import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Message {
  type: "edit";
  content: string;
  timestamp: string;
  user_id: string;
  session_id: string;
}

export function useRealtimeChannel(channelName: string) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);

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

  const sendMessage = (message: Message) => {
    supabase.channel(channelName).send({
      type: "broadcast",
      event: "message",
      payload: message,
    });
  };

  return { messages, sendMessage };
}
