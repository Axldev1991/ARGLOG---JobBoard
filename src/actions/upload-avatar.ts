"use server"

import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

/**
 * 🎨 SERVER ACTION: UPLOAD AVATAR
 * Sube la imagen de perfil recortada a Cloudinary y actualiza el usuario.
 */
export async function uploadAvatar(formData: FormData) {
    const session = await getSession();
    if (!session) return { error: "No autorizado" };

    const file = formData.get("avatar") as File;
    if (!file) return { error: "No se encontró el archivo" };

    try {
        console.log("📸 Iniciando subida de avatar para usuario:", session.id);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        console.log("📦 Buffer generado, tamaño:", buffer.length);

        const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "avatars",
                    public_id: `avatar_${session.id}`,
                    overwrite: true,
                    resource_type: "image",
                    access_mode: 'public',
                    // Aplicamos optimización base en Cloudinary
                    transformation: [
                        { width: 400, height: 400, crop: "fill", gravity: "face" },
                        { quality: "auto", fetch_format: "auto" }
                    ]
                },
                (error, result) => {
                    if (error) {
                        console.error("❌ Cloudinary Error:", error);
                        reject(error);
                    } else {
                        if (!result) return reject(new Error("Cloudinary upload failed: No result"));
                        console.log("✅ Cloudinary Success:", result.secure_url);
                        resolve(result as { secure_url: string; public_id: string });
                    }
                }
            );
            uploadStream.end(buffer);
        });

        // Actualizamos la base de datos
        const updatedUser = await prisma.user.update({
            where: { id: session.id },
            data: {
                avatarUrl: uploadResult.secure_url,
                avatarPublicId: uploadResult.public_id
            }
        });
        console.log("🗄️ Base de datos actualizada para el usuario:", session.id);

        // ACTUALIZAR SESIÓN (COOKIE) para que se refleje en el Navbar al instante
        const cookieStore = await cookies();
        const currentSessionString = cookieStore.get("user_session")?.value;
        if (currentSessionString) {
            const currentSession = JSON.parse(currentSessionString);
            const newSession = {
                ...currentSession,
                avatarUrl: updatedUser.avatarUrl,
                image: updatedUser.avatarUrl // Compatibilidad con NavbarClient
            };
            cookieStore.set("user_session", JSON.stringify(newSession), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            });
        }

        revalidatePath("/dashboard");
        return { success: true, url: uploadResult.secure_url };
    } catch (error) {
        console.error("Upload Avatar Error:", error);
        return { error: "Error al subir la imagen" };
    }
}
