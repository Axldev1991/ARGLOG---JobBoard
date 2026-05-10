import { z } from "zod";

// 🧠 ESQUEMA: LOGIN
// Permite validar tanto el email como el CUIT (para empresas)
export const LoginSchema = z.object({
    identifier: z.string().min(1, "El email o CUIT es obligatorio"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// 🧠 ESQUEMA: EMPLEO
// Define las reglas para publicar una oferta
export const JobSchema = z.object({
    title: z.string().min(5, "El título debe tener al menos 5 caracteres").max(100),
    description: z.string().min(20, "La descripción debe ser más detallada (mín. 20 chars)"),
    salary: z.string().optional().default("A convenir"),
    category: z.string().min(1, "La categoría es obligatoria"),
    modality: z.string().min(1, "La modalidad es obligatoria"),
    location: z.string().min(1, "La ubicación es obligatoria"),
    expiresAt: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
    tagIds: z.array(z.number()).default([]),
});

// 🧠 ESQUEMA: PERFIL DE USUARIO
// Valida los datos personales y profesionales
export const ProfileSchema = z.object({
    name: z.string().min(2, "El nombre es obligatorio").max(100),
    headline: z.string().max(100).optional().nullable(),
    bio: z.string().max(1000).optional().nullable(),
    phone: z.string().max(20).optional().nullable(),
    linkedin: z.string().url("Debe ser una URL válida de LinkedIn").optional().nullable().or(z.literal("")),
    city: z.string().max(100).optional().nullable(),
    tagIds: z.array(z.number()).default([]),
});

// 🧠 ESQUEMA: ACTUALIZACIÓN DE EMPLEO
export const UpdateJobSchema = JobSchema.extend({
    jobId: z.preprocess((val) => Number(val), z.number().positive("ID de oferta inválido"))
});

// 🧠 ESQUEMA: POSTULACIÓN
export const ApplyJobSchema = z.object({
    jobId: z.preprocess((val) => Number(val), z.number().positive("ID de oferta inválido")),
    message: z.string().max(500, "El mensaje no puede exceder los 500 caracteres").optional(),
});

// 🧠 ESQUEMA: CAMBIO DE CONTRASEÑA
export const UpdatePasswordSchema = z.object({
    currentPassword: z.string().min(1, "La contraseña actual es obligatoria"),
    newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "La confirmación es obligatoria"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

// 🧠 ESQUEMA: REGISTRO
export const RegisterSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    role: z.enum(["candidate", "company"], {
        message: "Selecciona un rol válido",
    }),
    tagIds: z.array(z.number()).default([]),
});
// 🧠 ESQUEMA: REGISTRO DE EMPRESA
export const RegisterCompanySchema = z.object({
    legalName: z.string().min(2, "La razón social debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    industry: z.string().optional().default("Logística"),
    cuit: z.string().min(8, "CUIT inválido").max(15, "CUIT inválido"),
});
// 🧠 ESQUEMA: PERFIL DE EMPRESA
export const CompanyProfileSchema = z.object({
    legalName: z.string().min(2, "El nombre legal debe tener al menos 2 caracteres"),
    website: z.string().url("La URL del sitio web debe ser válida").optional().or(z.literal("")),
    description: z.string().max(1000, "La descripción no puede superar 1000 caracteres").optional(),
    industry: z.string().min(1, "La industria es obligatoria"),
});
