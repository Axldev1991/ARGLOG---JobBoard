"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { requireAdminAction } from "@/lib/auth-guard"

/**
 * Toggles the visibility status of a job.
 * If PUBLISHED -> REJECTED.
 * If REJECTED -> PUBLISHED.
 * 
 * Used for content moderation by admins.
 */
export async function toggleJobStatus(jobId: number, currentStatus: string) {
    // 🛡️ SECURITY
    await requireAdminAction();

    const newStatus = currentStatus === "PUBLISHED" ? "REJECTED" : "PUBLISHED";

    try {
        await prisma.job.update({
            where: { id: jobId },
            data: { status: newStatus }
        });

        revalidatePath("/admin/dashboard");
        revalidatePath("/"); // Update public board
        return { success: true };

    } catch (error: any) {
        console.error("[toggleJobStatus] Error:", error);
        return { error: `Error updating status: ${error.message}` };
    }
}
