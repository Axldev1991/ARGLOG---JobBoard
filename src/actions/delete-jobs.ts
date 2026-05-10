"use server"

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Logger } from "@/lib/logger";
import { ApplyJobSchema } from "@/lib/schemas";

export async function deleteJob(formData: FormData) {
    // 1. Auth Check (Iron Dome)
    const session = await requireRole(['company', 'admin']);

    // 🧠 VALIDACIÓN DE DATOS (ZOD)
    const validated = ApplyJobSchema.safeParse({ 
        jobId: formData.get("jobId") 
    });

    if (!validated.success) {
        return { success: false, message: "ID de oferta inválido" };
    }

    const { jobId } = validated.data;

    try {
        // 2. Ownership Check (Iron Dome)
        const job = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!job) {
            return { success: false, message: "Oferta no encontrada" };
        }

        const isOwner = job.authorId === session.id;
        const isAdmin = session.role === 'admin';

        if (!isOwner && !isAdmin) {
            await Logger.warn("Intento de borrado de oferta ajena", "SERVER_ACTION", {
                userId: session.id,
                targetJobId: jobId
            });
            return { success: false, message: "No tienes permisos para borrar esta oferta" };
        }

        // 3. Delete
        await prisma.job.delete({
            where: { id: jobId }
        });

        // 4. Log & Revalidate
        await Logger.warn(`Oferta borrada: ${job.title}`, "SERVER_ACTION", {
            userId: session.id,
            jobTitle: job.title
        });

        revalidatePath("/dashboard");
        revalidatePath("/");

        return { success: true, message: "Oferta eliminada correctamente" };

    } catch (error) {
        await Logger.error("Error borrando oferta", "SERVER_ACTION", error, { jobId });
        return { success: false, message: "Error interno al borrar la oferta" };
    }
}