"use server"

import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { Logger } from "@/lib/logger";

export async function uploadCV(formData: FormData) {
    const file = formData.get("cv") as File;
    const user = await getSession();

    if (!user) {
        return { error: "No estás autenticado" };
    }

    if (!file || file.size === 0) {
        return { error: "No se seleccionó ningún archivo" };
    }

    // 🛡️ VALIDACIÓN DE TAMAÑO (Backend)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > MAX_SIZE) {
        return { error: "El archivo es demasiado grande. El límite es 5MB." };
    }

    if (file.type !== "application/pdf") {
        return { error: "Solo se permiten archivos PDF" };
    }

    // --------------------------------------------------------------------------
    // 🧠 PROCESAMIENTO DE ARCHIVOS EN SERVER ACTIONS
    // --------------------------------------------------------------------------
    // 1. Convertir `File` a `ArrayBuffer`: Next.js recibe el archivo como objeto Web Standard.
    // 2. Convertir a `Buffer`: Node.js necesita un Buffer para trabajar con streams.
    // --------------------------------------------------------------------------
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // --------------------------------------------------------------------------
    // ☁️ SUBIDA A CLOUDINARY (STREAM)
    // --------------------------------------------------------------------------
    // Usamos `upload_stream` porque es más eficiente para archivos que no están en disco local.
    // Envolvemos en Promise porque la SDK de Cloudinary usa Callbacks antiguos para streams.
    // --------------------------------------------------------------------------
    try {
        // 4. Subir a Cloudinary (Promesa)
        const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw", // Forzamos RAW para evitar problemas con PDFs
                    folder: "cvs",
                    public_id: `cv_${user.id}`, // Nombre fijo para que se sobrescriba
                    overwrite: true,
                    access_mode: 'public' // IMPORTANTE: Hacerlo público
                },
                (error, result) => {
                    if (error) {
                        Logger.error("Cloudinary Callback Error", "SERVER_ACTION", error);
                        reject(error);
                    } else {
                        if (!result) return reject(new Error("No result from Cloudinary"));
                        resolve(result as { secure_url: string; public_id: string });
                    }
                }
            );
            uploadStream.end(buffer);
        });

        // 5. Guardar URL + Public ID en DB
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resumeUrl: uploadResult.secure_url,
                resumePublicId: uploadResult.public_id // <--- NUEVO CAMPO
            }
        });

        revalidatePath("/dashboard");
        return { success: true, url: uploadResult.secure_url };

    } catch (error) {
        await Logger.error("Falló uploadCV", "SERVER_ACTION", error, { userId: user.id });
        return { error: "Error al subir el archivo a la nube" };
    }
}
