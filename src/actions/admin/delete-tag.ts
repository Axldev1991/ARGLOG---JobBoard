"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { requireAdminAction } from "@/lib/auth-guard"

/**
 * Deletes a tag by its ID.
 * Restricted to admin users only.
 */
export async function deleteTag(tagId: number) {
    await requireAdminAction();

    try {
        await prisma.tag.delete({
            where: { id: tagId }
        });

        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error) {
        return { error: "No se pudo eliminar el tag" };
    }
}
