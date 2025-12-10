import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to conditionally combine and merge Tailwind CSS classes.
 * It's a standard pattern (often called 'cn' for 'class name') using clsx and tailwind-merge.
 * @param inputs - An array of class values (strings, arrays, objects, or boolean)
 * @returns A merged and optimized string of CSS classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
