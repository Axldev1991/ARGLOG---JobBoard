"use server"

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { ProfileSchema } from "@/lib/schemas";

export async function updateProfile(formData: FormData) {
    const session = await getSession();
    if (!session) {
        return { error: "No autorizado" };
    }

    // 🧠 VALIDACIÓN DE DATOS (ZOD)
    const rawData = {
        name: formData.get("name"),
        headline: formData.get("headline"),
        bio: formData.get("bio"),
        phone: formData.get("phone"),
        linkedin: formData.get("linkedin"),
        city: formData.get("city"),
        tagIds: JSON.parse((formData.get("tags") as string) || "[]"),
    };

    const validated = ProfileSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: "Datos del perfil inválidos", details: validated.error.flatten() };
    }

    const { name, headline, bio, phone, linkedin, city, tagIds } = validated.data;

    try {
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
                    set: tagIds.map(id => ({ id }))
                }
            }
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: "Error al actualizar el perfil" };
    }
}
