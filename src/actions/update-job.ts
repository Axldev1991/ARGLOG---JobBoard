"use server"

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Logger } from "@/lib/logger";

export async function updateJob(formData: FormData) {
    const jobIdStr = formData.get("jobId") as string;
    const title = formData.get("title") as string;
    const salaryRaw = formData.get("salary") as string;
    const salary = salaryRaw?.trim() === "" ? "A convenir" : salaryRaw;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const modality = formData.get("modality") as string;
    const location = formData.get("location") as string;

    // El TagSelector envía un JSON string en el input hidden "tags"
    const tagsJson = formData.get("tags") as string;

    // 1. Auth Check
    const session = await getSession();
    if (!session) redirect("/login");

    if (!jobIdStr) {
        throw new Error("ID de oferta faltante");
    }

    const jobId = parseInt(jobIdStr);

    try {
        // 2. Ownership Check (Iron Dome)
        const existingJob = await prisma.job.findUnique({
            where: { id: jobId },
            include: { tags: true }
        });

        if (!existingJob) {
            throw new Error("Oferta no encontrada");
        }

        const isOwner = existingJob.authorId === session.id;
        const isAdmin = session.role === 'admin' || session.role === 'dev';

        if (!isOwner && !isAdmin) {
            await Logger.warn("Intento no autorizado de editar oferta", "SERVER_ACTION", {
                userId: session.id,
                jobId
            });
            throw new Error("No tienes permiso para editar esta oferta");
        }

        // 3. Procesar Tags (si vienen)
        let tagUpdateData = {};
        if (tagsJson) {
            try {
                const tagIds = JSON.parse(tagsJson) as number[];
                if (Array.isArray(tagIds)) {
                    // Lógica de Prisma para reemplazar tags (desconectar todos y conectar nuevos)
                    // NOTA: 'set' reemplaza todas las relaciones
                    tagUpdateData = {
                        tags: {
                            set: tagIds.map(id => ({ id }))
                        }
                    };
                }
            } catch (e) {
                console.error("Error parseando tags", e);
            }
        }

        // 4. Update
        await prisma.job.update({
            where: { id: jobId },
            data: {
                title,
                salary,
                description,
                category,
                modality,
                location,
                expiresAt: formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string) : null,
                ...tagUpdateData
            }
        });

        // 5. Revalidate & Redirect
        revalidatePath("/dashboard");
        revalidatePath(`/jobs/${jobId}`);
        redirect("/dashboard");

    } catch (error: any) {
        await Logger.error("Error editando oferta", "SERVER_ACTION", error, { jobId, title });
        // Si usamos redirect dentro de un try/catch en Next.js, hay que relanzarlo si es del tipo NEXT_REDIRECT
        if (error.message === "NEXT_REDIRECT") {
            throw error;
        }
        // Para otros errores, podríamos devolver un objeto si el form fuera useFormState, 
        // pero como es action directa, lanzaremos error o redirigiremos a página de error.
        // Por ahora lanzamos error para que lo capture el error boundary global o local.
        throw new Error(error.message || "Error al actualizar la oferta");
    }
}