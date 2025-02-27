import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and then merges Tailwind classes
 * with tailwind-merge to handle conflicts correctly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
