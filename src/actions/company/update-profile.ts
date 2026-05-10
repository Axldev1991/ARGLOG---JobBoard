"use server"

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Logger } from "@/lib/logger";
import { CompanyProfileSchema } from "@/lib/schemas";

export async function updateCompanyProfile(formData: FormData) {
    // 1. Auth Check (Iron Dome)
    const session = await requireRole(['company', 'admin']);

    // 🧠 VALIDACIÓN DE DATOS (ZOD)
    const rawData = {
        legalName: formData.get("legalName"),
        website: formData.get("website"),
        description: formData.get("description"),
        industry: formData.get("industry"),
    };

    const validated = CompanyProfileSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: "Datos de perfil inválidos", details: validated.error.flatten() };
    }

    const { legalName, website, description, industry } = validated.data;

    try {
        // 1. Obtener User + Profile para verificar existencia
        const user = await prisma.user.findUnique({
            where: { id: session.id },
            include: { companyProfile: true }
        });

        if (!user || !user.companyProfile) {
            return { error: "Perfil de empresa no encontrado." };
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
        
        // Verify the update
        const updatedProfile = await prisma.companyProfile.findUnique({
            where: { id: user.companyProfile.id }
        });
        console.log("[DEBUG] Profile after update:", updatedProfile);

        revalidatePath("/dashboard");
        return { success: true, message: "Perfil actualizado correctamente." };

    } catch (error) {
        await Logger.error("Error updating company profile", "SERVER_ACTION", error, { userId: session.id });
        return { error: "Ocurrió un error al actualizar el perfil." };
    }
}