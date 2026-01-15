"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/auth-guard";

export async function updateCandidate(candidateId: number, formData: FormData) {
    if (!await requireAdminAction()) {
        return { error: "No autorizado" };
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const headline = formData.get("headline") as string;
    const bio = formData.get("bio") as string;
    const city = formData.get("city") as string;
    const phone = formData.get("phone") as string;
    const linkedin = formData.get("linkedin") as string;
    const resumeUrl = formData.get("resumeUrl") as string;


    if (!name || !email) {
        return { error: "Nombre y Email son obligatorios" };
    }

    try {
        await prisma.user.update({
            where: { id: candidateId },
            data: {
                name,
                email,
                headline,
                bio,
                city,
                phone,
                linkedin,
                resumeUrl
            }
        });

        revalidatePath("/admin/dashboard");
        revalidatePath(`/admin/candidates/${candidateId}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating candidate:", error);
        return { error: "Error al actualizar candidato" };
    }
}
