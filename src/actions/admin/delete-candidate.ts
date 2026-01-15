"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { requireAdminAction } from "@/lib/auth-guard"

/**
 * Permanently deletes a candidate user account.
 * Protected by admin authentication.
 */
export async function deleteCandidate(candidateId: number) {
    // 🛡️ SECURITY
    await requireAdminAction();

    try {
        await prisma.user.delete({
            where: { id: candidateId }
        });

        // Revalidate dashboard to update the table
        revalidatePath("/admin/dashboard");
        return { success: true };

    } catch (error: any) {
        console.error("[deleteCandidate] Error:", error);
        return { error: `No se pudo eliminar: ${error.message}` };
    }
}
