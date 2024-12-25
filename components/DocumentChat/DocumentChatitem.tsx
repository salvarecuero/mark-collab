import { ChannelEvent } from "@/hooks/useRealtimeChannel";
import { format } from "date-fns";

export const DocumentChatItem = ({ message }: { message: ChannelEvent }) => {
  return (
    <li className="flex gap-x-1 text-sm">
      <span title={format(new Date(message.timestamp), "PPpp")}>
        {format(new Date(message.timestamp), "HH:mm")}
      </span>
      <span className="text-orange-200">{message.user_name}:</span>
      <p>{message.content}</p>
    </li>
  );
};
