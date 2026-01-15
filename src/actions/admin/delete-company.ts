"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { requireAdminAction } from "@/lib/auth-guard"
import { isProtectedUser } from "@/lib/protected-users"
import { Logger } from "@/lib/logger"

/**
 * Server Action para eliminar permanentemente una empresa.
 * ...
 */
export async function deleteCompany(companyId: number) {
    // 🛡️ SEGURIDAD
    await requireAdminAction();

    const company = await prisma.user.findUnique({
        where: { id: companyId }
    });

    if (company && isProtectedUser(company.email)) {
        return { error: "Acción Denegada: Esta cuenta está protegida." };
    }

    try {
        await prisma.user.delete({
            where: { id: companyId }
        });

        revalidatePath("/admin/dashboard");
        return { success: true };

    } catch (error: any) {
        await Logger.error("Falló deleteCompany", "SERVER_ACTION", error, { companyId });
        return { error: `No se pudo eliminar: ${error.message}` };
    }
}
