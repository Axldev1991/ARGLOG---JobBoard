"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { requireAdminAction } from "@/lib/auth-guard"

/**
 * Creates a new tag in the database.
 * Enforces admin authorization and handles unique constraint violations.
 */
export async function createTag(formData: FormData) {
    await requireAdminAction();

    const name = formData.get("name") as string;
    const type = formData.get("type") as string || "tech"; // Default to tech

    if (!name) return { error: "El nombre es requerido" };

    try {
        await prisma.tag.create({
            data: {
                name: name.trim(),
                type: type
            }
        });

        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error: any) {
        // Handle unique constraint violation
        if (error.code === 'P2002') {
            return { error: "Este tag ya existe." };
        }
        return { error: "Error al crear el tag" };
    }
}
