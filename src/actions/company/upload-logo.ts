"use server"

import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Logger } from "@/lib/logger";
import { ActionResponse } from "@/lib/actions"

/**
 * 🏢 SERVER ACTION: UPLOAD LOGO
 * Sube el logo de la empresa (recortado) a Cloudinary y actualiza el CompanyProfile.
 */
export async function uploadLogo(formData: FormData): Promise<ActionResponse<{ url: string }>> {
    const session = await getSession();
    if (!session) return { success: false, message: "No autorizado" };

    const file = formData.get("logo") as File;
    if (!file) return { success: false, message: "No se encontró el archivo" };

    try {
        // Obtenemos el perfil de la empresa del usuario actual
        const user = await prisma.user.findUnique({
            where: { id: session.id },
            include: { companyProfile: true }
        });

        if (!user || !user.companyProfile) {
            return { success: false, message: "Perfil de empresa no encontrado" };
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
                    transformation: [
                        { width: 400, height: 400, crop: "fill" },
                        { quality: "auto", fetch_format: "auto" }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else if (!result) reject(new Error("Cloudinary upload failed: No result"));
                    else resolve(result as { secure_url: string; public_id: string });
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
                image: updatedProfile.logo 
            };
            cookieStore.set("user_session", JSON.stringify(newSession), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            });
        }

        revalidatePath("/dashboard");
        return { success: true, message: "Logo corporativo actualizado", data: { url: uploadResult.secure_url } };
        
    } catch (error) {
        await Logger.error("Upload Logo Error", "SERVER_ACTION", error, { userId: session.id });
        return { success: false, message: "Error al subir el logo corporativo" };
    }
}
