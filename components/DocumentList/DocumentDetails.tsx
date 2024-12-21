import { formatDocumentListDate } from "@/lib/utils";

import { ClockIcon, Crown } from "lucide-react";

const DocumentDetails = ({
  updatedAt,
  isOwner,
}: {
  updatedAt: string;
  isOwner: boolean;
}) => {
  return (
    <div className="flex items-center gap-x-1">
      {isOwner && (
        <span className="text-white" title="You are the owner">
          <Crown size={16} />
        </span>
      )}
      <span
        className="cursor-default select-none flex items-center gap-x-1"
        title={`Last updated: ${formatDocumentListDate(updatedAt, true)}`}
      >
        <ClockIcon size={16} /> {formatDocumentListDate(updatedAt)}
      </span>
    </div>
  );
};

export default DocumentDetails;
