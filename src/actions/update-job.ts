"use server"

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { Logger } from "@/lib/logger";
import { UpdateJobSchema } from "@/lib/schemas";
import { formatZodErrors, ActionResponse } from "@/lib/actions";

/**
 * Server action to update an existing job posting.
 */
export async function updateJob(prevState: any, formData: FormData): Promise<ActionResponse> {
    const session = await getSession();
    if (!session) return { success: false, message: "Sesión no válida" };

    try {
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
            return { 
                success: false, 
                message: "Datos de la oferta inválidos", 
                errors: formatZodErrors(validated.error) 
            };
        }

        const { jobId, title, salary, description, category, modality, location, expiresAt, tagIds } = validated.data;

        // 1. Ownership Check (Iron Dome)
        const existingJob = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!existingJob) {
            return { success: false, message: "Oferta no encontrada" };
        }

        const isOwner = existingJob.authorId === session.id;
        const isAdmin = session.role === 'admin';

        if (!isOwner && !isAdmin) {
            await Logger.warn("Intento no autorizado de editar oferta", "SERVER_ACTION", {
                userId: session.id,
                jobId
            });
            return { success: false, message: "No tienes permiso para editar esta oferta" };
        }

        // 2. Update
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
        revalidatePath("/dashboard/company");
        revalidatePath(`/jobs/${jobId}`);
        
        return { success: true, message: "Oferta actualizada con éxito" };

    } catch (error: unknown) {
        await Logger.error("Error editando oferta", "SERVER_ACTION", error);
        return { success: false, message: "Ocurrió un error inesperado al actualizar la oferta" };
    }
}