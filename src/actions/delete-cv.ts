"use server"

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function deleteCV(_formData?: FormData) {
    const session = await getSession();
    if (!session) return { error: "No autorizado" };

    try {
        // 1. Obtener el Public ID de la base de datos
        const user = await prisma.user.findUnique({
            where: { id: session.id },
            select: { resumePublicId: true }
        });

        // 2. Si hay ID, borramos en Cloudinary
        if (user?.resumePublicId) {
            // Intentamos RAW primero (PDFs subidos como raw)
            const resRaw = await cloudinary.uploader.destroy(user.resumePublicId, { resource_type: 'raw', invalidate: true });

            // Si falló (not found), probamos como imagen por si acaso
            if (resRaw.result !== 'ok') {
                await cloudinary.uploader.destroy(user.resumePublicId, { resource_type: 'image', invalidate: true });
            }
        }

        // 3. Borrar referencia en DB
        await prisma.user.update({
            where: { id: session.id },
            data: {
                resumeUrl: null,
                resumePublicId: null
            }
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        await Logger.error("Error deleting CV", "SERVER_ACTION", error, { userId: session.id });
        return { error: "Error desconocido al eliminar el archivo" };
    }
}
