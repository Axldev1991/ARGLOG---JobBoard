"use server"

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
    const session = await getSession();
    if (!session) {
        return { error: "No autorizado" };
    }

    const name = formData.get("name") as string;
    const headline = formData.get("headline") as string;
    const bio = formData.get("bio") as string;
    const phone = formData.get("phone") as string;
    const linkedin = formData.get("linkedin") as string;
    const city = formData.get("city") as string;

    const tagsJson = formData.get("tags") as string;
    const tagIds = JSON.parse(tagsJson || "[]") as number[];

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
