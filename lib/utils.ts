import { type ClassValue, clsx } from "clsx";
import { format, isThisYear, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDocumentListDate(
  dateString: string,
  isTooltip?: boolean
) {
  const date = parseISO(dateString);

  if (isTooltip) {
    return format(date, "dd/MM/yyyy HH:mm:ss");
  }

  if (isThisYear(date)) {
    return format(date, "dd/MM HH:mm");
  } else {
    return format(date, "dd/MM/yyyy");
  }
}
