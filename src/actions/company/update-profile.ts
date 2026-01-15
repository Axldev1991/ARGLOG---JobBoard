"use server"

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { Logger } from "@/lib/logger";
import cloudinary from "@/lib/cloudinary";

export async function updateCompanyProfile(formData: FormData) {
    const session = await getSession();

    if (!session) {
        return { error: "No autorizado" };
    }

    const legalName = formData.get("legalName") as string;
    const website = formData.get("website") as string;
    const description = formData.get("description") as string;
    const industry = formData.get("industry") as string;
    const logoFile = formData.get("logo") as File | null;

    if (!legalName || !industry) {
        return { error: "Nombre legal e industria son obligatorios." };
    }

    try {
        // 1. Obtener User + Profile para verificar existencia
        const user = await prisma.user.findUnique({
            where: { id: session.id },
            include: { companyProfile: true }
        });

        if (!user || !user.companyProfile) {
            return { error: "Perfil de empresa no encontrado." };
        }

        let logoUrl = user.companyProfile.logo;

        // 2. Procesar Logo (Si hay uno nuevo)
        if (logoFile && logoFile.size > 0) {
            // Validación básica
            if (!logoFile.type.startsWith("image/")) {
                return { error: "El archivo debe ser una imagen." };
            }
            if (logoFile.size > 2 * 1024 * 1024) { // 2MB limit
                return { error: "El logo no debe pesar más de 2MB." };
            }

            const arrayBuffer = await logoFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Subir a Cloudinary
            const uploadResult = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: "job-board/logos",
                        resource_type: "image",
                        // Transformación opcional: Resize a cuadrado 200x200
                        transformation: [{ width: 200, height: 200, crop: "fill" }]
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            logoUrl = uploadResult.secure_url;
        }

        // 3. Update DB
        await prisma.companyProfile.update({
            where: { id: user.companyProfile.id },
            data: {
                legalName,
                website,
                description,
                industry,
                logo: logoUrl
            }
        });

        revalidatePath("/dashboard");
        return { success: true, message: "Perfil actualizado correctamente." };

    } catch (error) {
        await Logger.error("Error updating company profile", "SERVER_ACTION", error, { userId: session.id });
        return { error: "Ocurrió un error al actualizar el perfil." };
    }
}
