"use server"

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Logger } from "@/lib/logger";
import { requireRole } from "@/lib/auth";
import { JobSchema } from "@/lib/schemas";

export async function createJob(formData: FormData) {
    // 🧠 1. VERIFICACIÓN DE ROL (RBAC)
    const user = await requireRole(["admin", "company"]);

    // 🧠 2. VALIDACIÓN DE DATOS (ZOD)
    const rawData = {
        title: formData.get("title"),
        salary: formData.get("salary"),
        description: formData.get("description"),
        category: formData.get("category"),
        modality: formData.get("modality"),
        location: formData.get("location"),
        expiresAt: formData.get("expiresAt"),
        tagIds: JSON.parse((formData.get("tags") as string) || "[]"),
    };

    const validated = JobSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: "Datos del empleo inválidos", details: validated.error.flatten() };
    }

    const { title, salary, description, category, modality, location, expiresAt, tagIds } = validated.data;

    try {
        await prisma.job.create({
            data: {
                title,
                description,
                salary,
                category,
                modality,
                location,
                expiresAt,
                authorId: user.id,
                tags: {
                    connect: tagIds.map((id: number) => ({ id: id }))
                }
            }
        })
    } catch (error) {
        await Logger.error("Falló createJob", "SERVER_ACTION", error, { userId: user.id, title });
        throw error;
    }

    redirect("/dashboard")
}