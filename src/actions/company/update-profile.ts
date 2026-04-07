"use server"

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { Logger } from "@/lib/logger";
import cloudinary from "@/lib/cloudinary";
import { extractPublicId } from "@/lib/cloudinary-utils";
import { z } from "zod";

// Zod schema for company profile validation
const CompanyProfileSchema = z.object({
    legalName: z.string().min(2, "El nombre legal debe tener al menos 2 caracteres"),
    website: z.string().url("La URL del sitio web debe ser válida").optional().or(z.literal("")),
    description: z.string().max(1000, "La descripción no puede superar 1000 caracteres").optional(),
    industry: z.string().min(1, "La industria es obligatoria"),
});

export async function updateCompanyProfile(formData: FormData) {
    const session = await getSession();

    if (!session) {
        return { error: "No autorizado" };
    }

    // Extract fields from FormData
    const legalName = formData.get("legalName") as string;
    const website = formData.get("website") as string;
    const description = formData.get("description") as string;
    const industry = formData.get("industry") as string;
    const logoFile = formData.get("logo") as File | null;

    // Validate with Zod
    const validationResult = CompanyProfileSchema.safeParse({
        legalName,
        website,
        description,
        industry,
    });

    if (!validationResult.success) {
        const issues = validationResult.error.issues.map(issue => issue.message);
        return { error: issues.join(", ") };
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
            // Validación de tipo
            if (!logoFile.type.startsWith("image/")) {
                return { error: "El archivo debe ser una imagen." };
            }
            // Validación de tamaño (2MB limit)
            if (logoFile.size > 2 * 1024 * 1024) {
                return { error: "El logo no debe pesar más de 2MB." };
            }

            // 2.1 Cleanup: Delete previous logo from Cloudinary if exists
            if (user.companyProfile.logo) {
                const oldPublicId = extractPublicId(user.companyProfile.logo);
                if (oldPublicId) {
                    try {
                        await cloudinary.uploader.destroy(oldPublicId);
                    } catch (deleteError) {
                        // Log warning but continue - old logo is not critical
                        await Logger.error(
                            "Failed to delete old logo from Cloudinary",
                            "SERVER_ACTION",
                            deleteError,
                            { publicId: oldPublicId, userId: session.id }
                        );
                    }
                }
            }

            // 2.2 Upload new logo
            const arrayBuffer = await logoFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResult = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: "job-board/logos",
                        resource_type: "image",
                        transformation: [{ width: 200, height: 200, crop: "fill" }]
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            logoUrl = uploadResult.secure_url;
            console.log("[DEBUG] Logo uploaded successfully:", logoUrl);
        }

        // 3. Update DB
        console.log("[DEBUG] About to update DB with logo:", logoUrl);
        await prisma.companyProfile.update({
            where: { id: user.companyProfile.id },
            data: {
                legalName: validationResult.data.legalName,
                website: validationResult.data.website || null,
                description: validationResult.data.description || null,
                industry: validationResult.data.industry,
                logo: logoUrl
            }
        });
        
        // Verify the update
        const updatedProfile = await prisma.companyProfile.findUnique({
            where: { id: user.companyProfile.id }
        });
        console.log("[DEBUG] Profile after update:", updatedProfile);

        revalidatePath("/dashboard");
        return { success: true, message: "Perfil actualizado correctamente." };

    } catch (error) {
        await Logger.error("Error updating company profile", "SERVER_ACTION", error, { userId: session.id });
        return { error: "Ocurrió un error al actualizar el perfil." };
    }
}