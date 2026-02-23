"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { requireAdminAction } from "@/lib/auth-guard"
import { isProtectedUser } from "@/lib/protected-users"

/**
 * Permanently deletes a candidate user account.
 * Protected by admin authentication.
 */
export async function deleteCandidate(candidateId: number) {
    // 🛡️ SECURITY
    await requireAdminAction();

    // 1. Verificar si existe
    const candidate = await prisma.user.findUnique({
        where: { id: candidateId }
    });

    if (!candidate) {
        return { error: "Usuario no encontrado" };
    }

    // 🛡️ SECURITY: PROTECTED USERS
    if (isProtectedUser(candidate.email)) {
        return { error: "Acción Denegada: Este usuario está protegido por el sistema." };
    }

    try {
        await prisma.user.delete({
            where: { id: candidateId }
        });

        // Revalidate dashboard to update the table
        revalidatePath("/admin/dashboard");
        return { success: true };

    } catch (error) {
        console.error("[deleteCandidate] Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        return { error: `No se pudo eliminar el candidato: ${errorMessage}` };
    }
}
