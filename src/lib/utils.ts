import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Returns a YYYY-MM-DD string in the user's LOCAL timezone.
// Avoid `new Date().toISOString().split('T')[0]` — that returns the UTC date,
// which can be off by a day near midnight and is inconsistent with the
// Calendar page (which formats dates locally via date-fns).
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
