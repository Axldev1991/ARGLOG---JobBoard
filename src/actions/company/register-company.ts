"use server"

import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"
import { RegisterCompanySchema } from "@/lib/schemas"
import { Logger } from "@/lib/logger"
import { formatZodErrors, ActionResponse } from "@/lib/actions"

/**
 * Server action to register a new company request.
 */
export async function registerCompany(prevState: any, formData: FormData): Promise<ActionResponse> {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const validated = RegisterCompanySchema.safeParse(rawData);

        if (!validated.success) {
            return { 
                success: false, 
                message: "Por favor, revisa los errores en el formulario", 
                errors: formatZodErrors(validated.error) 
            };
        }

        const { legalName, email, password, cuit } = validated.data;

        // 1. Verificar si ya existe el usuario por email
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { 
                success: false, 
                message: "Este email ya está registrado",
                errors: { email: ["El correo electrónico ya está en uso"] }
            };
        }

        // 2. Verificar si ya existe el CUIT
        const existingCompany = await prisma.companyProfile.findUnique({
            where: { cuit }
        });

        if (existingCompany) {
            return { 
                success: false, 
                message: "Este CUIT ya está registrado",
                errors: { cuit: ["Ya existe una empresa registrada con este CUIT"] }
            };
        }

        // 3. Crear el usuario y el perfil de empresa asociados
        // Nota: Status PENDING por defecto
        await prisma.user.create({
            data: {
                name: legalName,
                email,
                password: await hash(password, 10),
                role: "company",
                status: "PENDING",
                companyProfile: {
                    create: {
                        legalName,
                        cuit,
                        industry: "Logística" // Default
                    }
                }
            }
        })

        return { 
            success: true, 
            message: "Solicitud enviada con éxito. Te avisaremos por email cuando sea aprobada." 
        }

    } catch (error) {
        await Logger.error("Error creating company request", "SERVER_ACTION", error);
        return { success: false, message: "Ocurrió un error inesperado al procesar tu solicitud" }
    }
}