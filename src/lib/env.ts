import { z } from "zod";

/**
 * Esquema de validación para las variables de entorno.
 * Esto asegura que la aplicación "falle rápido" si falta alguna clave crítica.
 */
const envSchema = z.object({
  // Base de Datos (Neon)
  DATABASE_URL: z.string().url({ message: "DATABASE_URL debe ser una URL de conexión válida" }),
  DIRECT_URL: z.string().url({ message: "DIRECT_URL debe ser una URL de conexión válida" }),

  // Servicio de Emails (Resend)
  RESEND_API_KEY: z.string().min(1, { message: "RESEND_API_KEY es obligatoria" }),

  // Almacenamiento de Imágenes (Cloudinary)
  CLOUDINARY_CLOUD_NAME: z.string().min(1, { message: "CLOUDINARY_CLOUD_NAME es obligatoria" }),
  CLOUDINARY_API_KEY: z.string().min(1, { message: "CLOUDINARY_API_KEY es obligatoria" }),
  CLOUDINARY_API_SECRET: z.string().min(1, { message: "CLOUDINARY_API_SECRET es obligatoria" }),

  // Opcionales o Legacy (pueden ser strings vacíos o no estar si no se usan)
  POSTGRES_PRISMA_URL: z.string().optional(),
  POSTGRES_URL_NON_POOLING: z.string().optional(),
});

// Validamos process.env contra el esquema
const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Error de configuración: Variables de entorno faltantes o inválidas:");
  console.error(JSON.stringify(result.error.flatten().fieldErrors, null, 2));
  throw new Error("Invalid environment variables");
}

export const env = result.data;
