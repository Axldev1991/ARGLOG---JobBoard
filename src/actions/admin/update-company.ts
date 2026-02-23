"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { requireAdminAction } from "@/lib/auth-guard"

/**
 * Server Action para modificar datos de una empresa existente.
 * Permite actualizar tanto identidad comercial (nombre, web) como legal (cuit, razón social).
 */
export async function updateCompany(companyId: number, formData: FormData) {
    // 🛡️ SEGURIDAD
    await requireAdminAction();

    // 1. Recibir datos
    const name = formData.get("name") as string
    const website = formData.get("website") as string

    // Datos legales
    const legalName = formData.get("legalName") as string
    const cuit = formData.get("cuit") as string
    const industry = formData.get("industry") as string
    const email = formData.get("email") as string

    // (Futuro) Podríamos manejar cambio de contraseña aquí si se desea.

    try {
        await prisma.user.update({
            where: { id: companyId },
            data: {
                name,
                email,
                companyProfile: {
                    update: {
                        legalName,
                        cuit,
                        industry,
                        website
                    }
                }
            }
        });

        revalidatePath("/admin/dashboard");
        return { success: true };

    } catch (error) {
        console.error("[updateCompany] Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        return { error: `Error técnico: ${errorMessage}` };
    }
}
