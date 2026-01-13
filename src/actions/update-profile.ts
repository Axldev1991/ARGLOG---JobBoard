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

    const headline = formData.get("headline") as string;
    const bio = formData.get("bio") as string;
    const phone = formData.get("phone") as string;
    const linkedin = formData.get("linkedin") as string;
    const city = formData.get("city") as string;

    try {
        await prisma.user.update({
            where: { id: session.id },
            data: {
                headline,
                bio,
                phone,
                linkedin,
                city
            }
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: "Error al actualizar el perfil" };
    }
}
