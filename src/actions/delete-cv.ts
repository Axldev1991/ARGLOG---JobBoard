"use server"

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function deleteCV() {
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
            console.log("🗑️ Intentando borrar ID Cloudinary:", user.resumePublicId);

            // Intentamos RAW primero (PDFs subidos como raw)
            // invalidate: true fuerza a limpiar el caché del CDN
            const resRaw = await cloudinary.uploader.destroy(user.resumePublicId, { resource_type: 'raw', invalidate: true });
            console.log("👉 Resultado Cloudinary (RAW):", resRaw);

            // Si falló (not found), probamos como imagen por si acaso
            if (resRaw.result !== 'ok') {
                const resImg = await cloudinary.uploader.destroy(user.resumePublicId, { resource_type: 'image', invalidate: true });
                console.log("👉 Resultado Cloudinary (IMG):", resImg);
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
    } catch (error: any) { // Type any para obtener el mensaje
        console.error("🔥 Error Catch General:", error);
        // RETORNAMOS EL ERROR REAL A LA UI
        return { error: error.message || "Error desconocido al subir" };
    }
}
