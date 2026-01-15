"use server"

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { Logger } from "@/lib/logger";

export async function deleteJob(formData: FormData) {
    const jobIdStr = formData.get("jobId") as string;

    if (!jobIdStr) {
        return { success: false, message: "ID de oferta no válido" };
    }

    const jobId = parseInt(jobIdStr);

    try {
        // 1. Auth & Session
        const session = await getSession();
        if (!session) {
            return { success: false, message: "No autorizado" };
        }

        // 2. Ownership Check (Iron Dome)
        const job = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!job) {
            return { success: false, message: "Oferta no encontrada" };
        }

        const isOwner = job.authorId === session.id;
        const isAdmin = session.role === 'admin' || session.role === 'dev';

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