import { z } from "zod";

export type ActionResponse<T = any> = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
};

/**
 * Helper para formatear errores de Zod en un objeto plano utilizable por el frontend.
 */
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  return error.flatten().fieldErrors as Record<string, string[]>;
}

/**
 * Estado inicial para useActionState
 */
export const EMPTY_ACTION_STATE: ActionResponse = {
  success: false,
  message: "",
};
