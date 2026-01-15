"use server"

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export type JobStatus = 'PUBLISHED' | 'PAUSED' | 'CLOSED';

export async function updateJobStatus(jobId: number, newStatus: JobStatus) {
    const session = await getSession();
    if (!session) {
        return { success: false, message: "No autorizado" };
    }

    try {
        // 1. Verificar propiedad (Iron Dome)
        const job = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!job) {
            return { success: false, message: "Oferta no encontrada" };
        }

        const isOwner = job.authorId === session.id;
        const isAdmin = session.role === 'admin' || session.role === 'dev';

        if (!isOwner && !isAdmin) {
            return { success: false, message: "No tienes permiso para modificar esta oferta" };
        }

        // 2. Actualizar Estado
        await prisma.job.update({
            where: { id: jobId },
            data: { status: newStatus }
        });

        // 3. Revalidate
        revalidatePath("/dashboard");
        revalidatePath(`/jobs/${jobId}`);
        revalidatePath("/"); // Home podría cambiar si se pausa

        return { success: true, message: `Oferta marcada como ${newStatus}` };

    } catch (error) {
        console.error("Error updating job status:", error);
        return { success: false, message: "Error al actualizar el estado" };
    }
}
