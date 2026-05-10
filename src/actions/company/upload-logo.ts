"use server"

import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

/**
 * 🏢 SERVER ACTION: UPLOAD LOGO
 * Sube el logo de la empresa (recortado) a Cloudinary y actualiza el CompanyProfile.
 */
export async function uploadLogo(formData: FormData) {
    const session = await getSession();
    if (!session) return { error: "No autorizado" };

    const file = formData.get("logo") as File;
    if (!file) return { error: "No se encontró el archivo" };

    try {
        // Obtenemos el perfil de la empresa del usuario actual
        const user = await prisma.user.findUnique({
            where: { id: session.id },
            include: { companyProfile: true }
        });

        if (!user || !user.companyProfile) {
            return { error: "Perfil de empresa no encontrado" };
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "job-board/logos",
                    public_id: `logo_cp_${user.companyProfile!.id}`,
                    overwrite: true,
                    resource_type: "image",
                    access_mode: 'public',
                    // Optimizaciones para logos (400x400 para alta densidad, recorte central)
                    transformation: [
                        { width: 400, height: 400, crop: "fill" },
                        { quality: "auto", fetch_format: "auto" }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        // Actualizamos el perfil de la empresa
        const updatedProfile = await prisma.companyProfile.update({
            where: { id: user.companyProfile.id },
            data: {
                logo: uploadResult.secure_url,
                logoPublicId: uploadResult.public_id
            }
        });

        // TAMBIÉN actualizamos la imagen principal del usuario para que el Navbar sea consistente
        await prisma.user.update({
            where: { id: session.id },
            data: { avatarUrl: updatedProfile.logo }
        });

        // ACTUALIZAR SESIÓN (COOKIE) 
        const cookieStore = await cookies();
        const currentSessionString = cookieStore.get("user_session")?.value;
        if (currentSessionString) {
            const currentSession = JSON.parse(currentSessionString);
            const newSession = {
                ...currentSession,
                image: updatedProfile.logo // El Navbar usa .image de la sesión
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
        console.error("Upload Logo Error:", error);
        return { error: "Error al subir el logo corporativo" };
    }
}
