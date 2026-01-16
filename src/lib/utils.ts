import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isProfileComplete(user: any): boolean {
  if (!user) return false;

  // Validamos campos básicos dependiendo del rol (o general)
  // Asumimos candidato por defecto para esta validación simple
  const hasName = !!user.name;
  const hasEmail = !!user.email;
  const hasHeadline = !!user.headline;
  const hasCity = !!user.city;
  // const hasResume = !!user.resumeUrl; // Opcional según criterio

  return hasName && hasEmail && hasHeadline && hasCity;
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${path}`;
}
