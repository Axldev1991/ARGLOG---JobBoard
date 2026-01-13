"use server"

import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function uploadCV(formData: FormData) {
    const file = formData.get("cv") as File;
    const user = await getSession();

    if (!user) {
        return { error: "No estás autenticado" };
    }

    if (!file || file.size === 0) {
        return { error: "No se seleccionó ningún archivo" };
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
        console.log("📤 Iniciando subida a Cloudinary...");
        const uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    type: "upload",
                    folder: "curriculums",
                    public_id: `cv_${user.id}`,
                    access_mode: 'public',
                },
                (error, result) => {
                    if (error) {
                        console.error("❌ Error de Cloudinary:", error);
                        reject(error);
                    } else {
                        console.log("✅ Éxito Cloudinary. URL:", result?.secure_url);
                        resolve(result);
                    }
                }
            ).end(buffer);
        });

        // 3. Guardar URL en Base de Datos Postgres
        const finalUser = await prisma.user.update({
            where: { id: user.id },
            data: { resumeUrl: uploadResult.secure_url }
        });
        console.log("💾 Guardado en DB. Usuario:", finalUser.email, "URL:", finalUser.resumeUrl);

        revalidatePath("/dashboard");
        return { success: true, url: uploadResult.secure_url };

    } catch (error) {
        console.error("🔥 Error Catch General:", error);
        return { error: "Error al subir el archivo a la nube" };
    }
}
