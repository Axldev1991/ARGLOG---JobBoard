"use server"

import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"
import { z } from "zod"
import { Logger } from "@/lib/logger"
import { Resend } from "resend"
import { env } from "@/lib/env"

// Schema de validación para registro de empresa
const RegisterCompanySchema = z.object({
    legalName: z.string().min(2, "La razón social debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    industry: z.string().optional().default("Logística"),
    cuit: z.string().min(8, "CUIT inválido").max(15, "CUIT inválido"),
})

export async function registerCompany(formData: FormData) {
    try {
        // 1. Extraer datos del formData
        const legalName = formData.get("legalName") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const industry = (formData.get("industry") as string) || "Logística"
        const cuit = formData.get("cuit") as string

        // 2. Validar con Zod
        const validationResult = RegisterCompanySchema.safeParse({
            legalName,
            email,
            password,
            industry,
            cuit,
        })

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map(i => i.message).join(", ")
            return { error: errors }
        }

        // 3. Verificar que el email no exista
        const existingEmail = await prisma.user.findUnique({
            where: { email }
        })

        if (existingEmail) {
            return { error: "Este email ya está registrado" }
        }

        // 4. Verificar que el CUIT no exista
        const existingCuit = await prisma.companyProfile.findUnique({
            where: { cuit }
        })

        if (existingCuit) {
            return { error: "Este CUIT ya está registrado" }
        }

        // 5. Crear usuario con status PENDING y CompanyProfile
        const hashedPassword = await hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                name: legalName,
                email,
                password: hashedPassword,
                role: "company",
                status: "PENDING",
                companyProfile: {
                    create: {
                        legalName,
                        industry,
                        cuit,
                    }
                }
            },
            include: {
                companyProfile: true
            }
        })

        // 6. Enviar email al admin
        try {
            const resend = new Resend(env.RESEND_API_KEY)
            
            await resend.emails.send({
                from: "ArLog Jobs <onboarding@resend.dev>",
                to: "admin@arlog.org",
                subject: "Nueva solicitud de registro - Empresa",
                html: `
                    <h1>Nueva solicitud de registro</h1>
                    <p>Una empresa ha solicitado unirse a ArLog Jobs.</p>
                    <h2>Datos de la empresa:</h2>
                    <ul>
                        <li><strong>Razón Social:</strong> ${legalName}</li>
                        <li><strong>CUIT:</strong> ${cuit}</li>
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Industria:</strong> ${industry}</li>
                    </ul>
                    <p>Para aprobar o rechazar esta solicitud, ingresa al panel de administración.</p>
                `
            })
        } catch (emailError) {
            // Log error pero no fallar el registro
            await Logger.error(
                "Failed to send admin notification email",
                "SERVER_ACTION",
                emailError,
                { userId: newUser.id }
            )
        }

        await Logger.warn(
            "Company registration request created",
            "SERVER_ACTION",
            { userId: newUser.id, email, legalName }
        )

        return { 
            success: true, 
            message: "Tu solicitud de registro ha sido enviada. Un administrador revisará tu información y te notificará por email." 
        }

    } catch (error) {
        await Logger.error("Error registering company", "SERVER_ACTION", error)
        return { error: "Error al procesar el registro" }
    }
}