import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Esta función mezcla clases de Tailwind sin conflictos
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}