"use server"

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { ProfileSchema } from "@/lib/schemas";
import { Logger } from "@/lib/logger";
import { formatZodErrors, ActionResponse } from "@/lib/actions"

/**
 * Server action to update a candidate profile.
 */
export async function updateProfile(prevState: any, formData: FormData): Promise<ActionResponse> {
    const session = await getSession();
    if (!session) {
        return { success: false, message: "No autorizado" };
    }

    try {
        // 🧠 VALIDACIÓN DE DATOS (ZOD)
        const rawData = Object.fromEntries(formData.entries());
        const tagIds = JSON.parse((formData.get("tags") as string) || "[]");

        const validated = ProfileSchema.safeParse({
            ...rawData,
            tagIds,
        });

        if (!validated.success) {
            return { 
                success: false, 
                message: "Datos del perfil inválidos", 
                errors: formatZodErrors(validated.error) 
            };
        }

        const { name, headline, bio, phone, linkedin, city, tagIds: validatedTagIds } = validated.data;

        await prisma.user.update({
            where: { id: session.id },
            data: {
                name,
                headline,
                bio,
                phone,
                linkedin,
                city,
                tags: {
                    set: validatedTagIds.map(id => ({ id }))
                }
            }
        });

        revalidatePath("/dashboard");
        return { success: true, message: "¡Perfil actualizado con éxito!" };
        
    } catch (error) {
        await Logger.error("Error updating candidate profile", "SERVER_ACTION", error, { userId: session.id });
        return { success: false, message: "Error al actualizar el perfil" };
    }
}
