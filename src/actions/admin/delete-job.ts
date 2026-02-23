"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { requireAdminAction } from "@/lib/auth-guard"

/**
 * Permanently deletes a job.
 * Protected by admin authentication.
 */
export async function deleteJob(jobId: number) {
    // 🛡️ SECURITY
    await requireAdminAction();

    try {
        await prisma.job.delete({
            where: { id: jobId }
        });

        revalidatePath("/admin/dashboard");
        revalidatePath("/");
        return { success: true };

    } catch (error) {
        console.error("[deleteJob] Error:", error);
        return { error: "No se pudo eliminar la oferta" };
    }
}
