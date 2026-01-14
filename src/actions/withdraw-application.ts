"use server"

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function withdrawApplication(applicationId: number) {
    const session = await getSession();

    if (!session) {
        return { error: "No autorizado" };
    }

    try {
        // 1. Verificar que la postulación exista y pertenezca al usuario
        const application = await prisma.application.findUnique({
            where: { id: applicationId }
        });

        if (!application) {
            return { error: "Postulación no encontrada" };
        }

        if (application.userId !== session.id) {
            return { error: "No tienes permiso para realizar esta acción" };
        }

        // 2. Verificar estado (Solo PENDING se puede cancelar)
        if (application.status !== 'PENDING') {
            return { error: "No puedes retirar una postulación que ya ha sido procesada." };
        }

        // 3. Eliminar
        await prisma.application.delete({
            where: { id: applicationId }
        });

        revalidatePath("/dashboard");
        revalidatePath(`/jobs/${application.jobId}`); // Refrescar el detalle de la oferta también

        return { success: true };

    } catch (error) {
        console.error("Error al retirar postulación:", error);
        return { error: "Error al retirar la postulación" };
    }
}
