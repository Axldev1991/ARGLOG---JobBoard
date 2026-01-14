"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { requireAdminAction } from "@/lib/auth-guard"

/**
 * Server Action para eliminar permanentemente una empresa.
 * ...
 */
export async function deleteCompany(companyId: number) {
    // 🛡️ SEGURIDAD
    await requireAdminAction();

    try {
        await prisma.user.delete({
            where: { id: companyId }
        });

        revalidatePath("/admin/dashboard");
        return { success: true };

    } catch (error: any) {
        console.error("[deleteCompany] Error:", error);
        return { error: `No se pudo eliminar: ${error.message}` };
    }
}
