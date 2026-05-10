"use server"

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Logger } from "@/lib/logger";
import { UpdateJobSchema } from "@/lib/schemas";

export async function updateJob(formData: FormData) {
    // 1. Auth Check
    const session = await getSession();
    if (!session) redirect("/login");

    // 🧠 VALIDACIÓN DE DATOS (ZOD)
    const rawData = {
        jobId: formData.get("jobId"),
        title: formData.get("title"),
        salary: formData.get("salary") || "A convenir",
        description: formData.get("description"),
        category: formData.get("category"),
        modality: formData.get("modality"),
        location: formData.get("location"),
        expiresAt: formData.get("expiresAt"),
        tagIds: JSON.parse((formData.get("tags") as string) || "[]"),
    };

    const validated = UpdateJobSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: "Datos de la oferta inválidos", details: validated.error.flatten() };
    }

    const { jobId, title, salary, description, category, modality, location, expiresAt, tagIds } = validated.data;

    try {
        // 2. Ownership Check (Iron Dome)
        const existingJob = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!existingJob) {
            throw new Error("Oferta no encontrada");
        }

        const isOwner = existingJob.authorId === session.id;
        const isAdmin = session.role === 'admin';

        if (!isOwner && !isAdmin) {
            await Logger.warn("Intento no autorizado de editar oferta", "SERVER_ACTION", {
                userId: session.id,
                jobId
            });
            throw new Error("No tienes permiso para editar esta oferta");
        }

        // 3. Update
        await prisma.job.update({
            where: { id: jobId },
            data: {
                title,
                salary,
                description,
                category,
                modality,
                location,
                expiresAt,
                tags: {
                    set: tagIds.map(id => ({ id }))
                }
            }
        });

        revalidatePath("/dashboard");
        revalidatePath(`/jobs/${jobId}`);
        return { success: true };

    } catch (error: any) {
        await Logger.error("Error editando oferta", "SERVER_ACTION", error, { jobId, title });
        if (error.message === "NEXT_REDIRECT") throw error;
        return { error: error.message || "Error al actualizar la oferta" };
    }
}