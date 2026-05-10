"use server"

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { JobSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { formatZodErrors, ActionResponse } from "@/lib/actions";

export async function createJob(prevState: any, formData: FormData): Promise<ActionResponse> {
    const session = await getSession();

    if (!session || session.role !== "company") {
        return { success: false, message: "No autorizado" };
    }

    try {
        const rawData = Object.fromEntries(formData.entries());
        
        // El JobForm envía los tags como JSON stringificado en un input oculto
        const tagsJson = formData.get("tags") as string;
        const tagIds = tagsJson ? JSON.parse(tagsJson) : [];

        const validated = JobSchema.safeParse({
            ...rawData,
            tagIds,
        });

        if (!validated.success) {
            return { 
                success: false, 
                message: "Por favor, revisa los errores en el formulario", 
                errors: formatZodErrors(validated.error) 
            };
        }

        // Extraemos tagIds para manejar la conexión de Prisma por separado
        const { tagIds: validatedTagIds, ...jobData } = validated.data;

        const job = await prisma.job.create({
            data: {
                ...jobData,
                authorId: session.id,
                status: "PUBLISHED",
                tags: {
                    connect: validatedTagIds.map((id: number) => ({ id })),
                },
            },
        });
        
        revalidatePath("/");
        revalidatePath("/dashboard/company");

        return { 
            success: true, 
            message: "Oferta creada con éxito",
            data: { id: job.id } 
        };
    } catch (error) {
        console.error("Error al crear oferta:", error);
        return { success: false, message: "Ocurrió un error inesperado al procesar la solicitud" };
    }
}