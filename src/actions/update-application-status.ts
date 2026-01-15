"use server"

import { prisma } from "@/lib/db"
import { getSession } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { Logger } from "@/lib/logger"

/**
 * Server Action para actualizar el estado de una postulación.
 * Solo puede ser ejecutada por:
 * 1. La empresa dueña de la oferta.
 * 2. Un admin/dev (via impersonation o directo).
 * 
 * @param applicationId ID de la postulación
 * @param newStatus Nuevo estado (PENDING, HIRED, REJECTED)
 */
export async function updateApplicationStatus(applicationId: number, newStatus: string) {
    const validStatuses = ['PENDING', 'HIRED', 'REJECTED'];

    if (!validStatuses.includes(newStatus)) {
        return { success: false, message: "Estado inválido." };
    }

    try {
        // 1. Auth Check
        const session = await getSession();
        if (!session) {
            return { success: false, message: "No autorizado." };
        }

        // 2. Authorization Check (Iron Dome Pattern)
        // Buscamos la postulación y vemos quién es el dueño del Job asociado
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: { job: true }
        });

        if (!application) {
            return { success: false, message: "Postulación no encontrada." };
        }

        // Si es Admin/Dev pasa, si es Empresa debe ser la dueña
        const isOwner = application.job.authorId === session.id;
        const isAdmin = session.role === 'admin' || session.role === 'dev';

        if (!isOwner && !isAdmin) {
            await Logger.warn(
                "Intento de acceso no autorizado a updateApplicationStatus",
                "SERVER_ACTION",
                { userId: session.id, applicationId }
            );
            return { success: false, message: "No tienes permiso para gestionar esta postulación." };
        }

        // 3. Update Status
        await prisma.application.update({
            where: { id: applicationId },
            data: { status: newStatus }
        });

        // 4. Revalidate cache
        revalidatePath(`/dashboard/jobs/${application.job.id}`);

        return { success: true };

    } catch (error) {
        await Logger.error(
            "Falló al actualizar estado de postulación",
            "SERVER_ACTION",
            error,
            { applicationId, newStatus }
        );
        return { success: false, message: "Error interno del servidor." };
    }
}
