"use server"

import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"
import { resend } from "@/lib/resend"
import { requireAdminAction } from "@/lib/auth-guard"
import { z } from "zod"

/**
 * Server Action para dar de alta una nueva empresa (B2B).
 * 1. Crea el usuario y el perfil de empresa en una transacción.
 * 2. Envía un email de bienvenida con credenciales temporales.
 * 
 * @param formData Datos del formulario de creación
 */
export async function createCompany(formData: FormData) {
    // 🛡️ SEGURIDAD: Solo admins pueden ejecutar esto
    await requireAdminAction();

    // 🛡️ SEGURIDAD: Definimos el esquema de validación estricto
    const CreateCompanySchema = z.object({
        name: z.string().min(2, "El nombre de contacto es muy corto"),
        email: z.string().email("Email inválido"),
        website: z.string().url("Debe ser una URL válida (https://...)").optional().or(z.literal("")),
        legalName: z.string().min(2, "Razón social requerida"),
        cuit: z.string().regex(/^\d{11}$/, "CUIT debe tener 11 números sin guiones"),
        industry: z.string().min(2, "Industria requerida")
    });

    // Parseamos los datos del FormData
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        website: formData.get("website"),
        legalName: formData.get("legalName"),
        cuit: formData.get("cuit"),
        industry: formData.get("industry")
    };

    // Validamos
    const validation = CreateCompanySchema.safeParse(rawData);

    if (!validation.success) {
        return { error: validation.error.issues[0].message };
    }

    const { name, email, website, legalName, cuit, industry } = validation.data;

    // Generamos contraseña temporal aleatoria
    const tempPassword = "Arlog" + Math.floor(Math.random() * 10000);

    try {
        const hashedPassword = await hash(tempPassword, 10);

        // Nested Write: Creamos Usuario + Perfil en un solo paso atómico
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "company",
                companyProfile: {
                    create: {
                        legalName,
                        cuit,
                        industry,
                        website,
                        description: "Empresa verificada por ArLog. Pendiente de completar descripción."
                    }
                }
            }
        });

        // Notificación por Email
        // Nota: En modo DEV de Resend, solo funciona si el destinatario es tu propio email verificado.
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: '👑 Bienvenido a ArLog - Accesos de Empresa',
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h1>¡Bienvenido ${name}!</h1>
                    <p>El equipo de ArLog ha dado de alta tu perfil corporativo.</p>
                    <hr style="border: 0; border-top: 1px solid #eaeaea;" />
                    <p><strong>Razón Social:</strong> ${legalName} (CUIT: ${cuit})</p>
                    
                    <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin:0 0 10px 0;"><strong>Tus credenciales temporales:</strong></p>
                        <p style="margin:5px 0;">📧 Email: <strong>${email}</strong></p>
                        <p style="margin:0;">🔑 Contraseña: <strong>${tempPassword}</strong></p>
                    </div>
                    
                    <p style="font-size: 14px; color: #666;">
                        Por favor ingresa y cambia tu contraseña desde tu perfil.
                    </p>
                </div>
            `
        });

        return { success: true };

    } catch (error: any) {
        console.error("[createCompany] Error:", error);
        // Devolvemos el mensaje técnico para facilitar el debug en desarrollo
        return { error: `Error técnico: ${error.message}` };
    }
}
