"use server"

import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"
import { RegisterSchema } from "@/lib/schemas"
import { Logger } from "@/lib/logger"

/**
 * Server action to register a new user.
 */
export async function registerUser(formData: FormData) {
    // 🧠 VALIDACIÓN DE DATOS (ZOD)
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
        tagIds: JSON.parse((formData.get("tags") as string) || "[]"),
    };

    const validated = RegisterSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: "Datos de registro inválidos", details: validated.error.flatten() };
    }

    const { name, email, password, role, tagIds } = validated.data;

    try {
        // 1. Verificar si ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: "Este email ya está registrado" }
        }

        // 2. Crear el usuario en la DB con sus tags
        await prisma.user.create({
            data: {
                name,
                email,
                password: await hash(password, 10),
                role,
                tags: {
                    connect: tagIds.map(id => ({ id }))
                }
            }
        })

        return { success: true }

    } catch (error) {
        await Logger.error("Error creating user", "SERVER_ACTION", error, { email });
        return { error: "Error al crear usuario" }
    }
}