"use server"

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Logger } from "@/lib/logger";
import { CompanyProfileSchema } from "@/lib/schemas";
import { formatZodErrors, ActionResponse } from "@/lib/actions"

/**
 * Server action to update a company profile.
 */
export async function updateCompanyProfile(prevState: any, formData: FormData): Promise<ActionResponse> {
    // 1. Auth Check (Iron Dome)
    const session = await requireRole(['company', 'admin']);

    try {
        // 🧠 VALIDACIÓN DE DATOS (ZOD)
        const rawData = Object.fromEntries(formData.entries());
        const validated = CompanyProfileSchema.safeParse(rawData);

        if (!validated.success) {
            return { 
                success: false, 
                message: "Datos de perfil inválidos", 
                errors: formatZodErrors(validated.error) 
            };
        }

        const { legalName, website, description, industry } = validated.data;

        // 2. Obtener User + Profile para verificar existencia
        const user = await prisma.user.findUnique({
            where: { id: session.id },
            include: { companyProfile: true }
        });

        if (!user || !user.companyProfile) {
            return { success: false, message: "Perfil de empresa no encontrado." };
        }

        // 3. Update DB
        await prisma.companyProfile.update({
            where: { id: user.companyProfile.id },
            data: {
                legalName,
                website: website || null,
                description: description || null,
                industry,
            }
        });
        
        revalidatePath("/dashboard");
        return { success: true, message: "Perfil actualizado correctamente." };

    } catch (error) {
        await Logger.error("Error updating company profile", "SERVER_ACTION", error, { userId: session.id });
        return { success: false, message: "Ocurrió un error al actualizar el perfil." };
    }
}