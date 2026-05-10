"use server"

import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { Logger } from "@/lib/logger";
import { ActionResponse } from "@/lib/actions"

/**
 * Server action to upload a CV (PDF).
 */
export async function uploadCV(formData: FormData): Promise<ActionResponse<{ url: string }>> {
    const file = formData.get("cv") as File;
    const user = await getSession();

    if (!user) {
        return { success: false, message: "No estás autenticado" };
    }

    if (!file || file.size === 0) {
        return { success: false, message: "No se seleccionó ningún archivo" };
    }

    // 🛡️ VALIDACIÓN DE TAMAÑO (Backend)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > MAX_SIZE) {
        return { success: false, message: "El archivo es demasiado grande. El límite es 5MB." };
    }

    if (file.type !== "application/pdf") {
        return { success: false, message: "Solo se permiten archivos PDF" };
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Subir a Cloudinary (Promesa)
        const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw", 
                    folder: "cvs",
                    public_id: `cv_${user.id}`, 
                    overwrite: true,
                    access_mode: 'public'
                },
                (error, result) => {
                    if (error) reject(error);
                    else if (!result) reject(new Error("No result from Cloudinary"));
                    else resolve(result as { secure_url: string; public_id: string });
                }
            );
            uploadStream.end(buffer);
        });

        // Guardar URL + Public ID en DB
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resumeUrl: uploadResult.secure_url,
                resumePublicId: uploadResult.public_id
            }
        });

        revalidatePath("/dashboard");
        return { success: true, message: "CV actualizado con éxito", data: { url: uploadResult.secure_url } };

    } catch (error) {
        await Logger.error("Falló uploadCV", "SERVER_ACTION", error, { userId: user.id });
        return { success: false, message: "Error al subir el archivo a la nube" };
    }
}
