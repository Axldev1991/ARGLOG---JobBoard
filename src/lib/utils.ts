import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// user type es 'any' por ahora, idealmente inferido de Prisma
export function isProfileComplete(user: any): boolean {
  if (!user) return false;

  // Lista de campos requeridos para postularse
  const requiredFields = [
    user.resumeUrl,
    user.headline,
    user.phone,
    user.city
    // Bio y LinkedIn pueden ser opcionales
  ];

  return requiredFields.every(field => field && field.trim().length > 0);
}

export function formatDate(date: Date | string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}