import { redirect } from "next/navigation";
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

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}
