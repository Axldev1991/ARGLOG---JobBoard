"use server"

import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"
import { RegisterSchema } from "@/lib/schemas"
import { Logger } from "@/lib/logger"
import { formatZodErrors, ActionResponse } from "@/lib/actions"

/**
 * Server action to register a new user.
 */
export async function registerUser(prevState: any, formData: FormData): Promise<ActionResponse> {
    try {
        // 🧠 VALIDACIÓN DE DATOS (ZOD)
        const rawData = Object.fromEntries(formData.entries());
        const tagIds = JSON.parse((formData.get("tags") as string) || "[]");

        const validated = RegisterSchema.safeParse({
            ...rawData,
            tagIds,
        });

        if (!validated.success) {
            return { 
                success: false, 
                message: "Por favor, revisa los errores en el formulario", 
                errors: formatZodErrors(validated.error) 
            };
        }

        const { name, email, password, role, tagIds: validatedTagIds } = validated.data;

        // 1. Verificar si ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { 
                success: false, 
                message: "Este email ya está registrado",
                errors: { email: ["El correo electrónico ya está en uso"] }
            }
        }

        // 2. Crear el usuario en la DB con sus tags
        await prisma.user.create({
            data: {
                name,
                email,
                password: await hash(password, 10),
                role,
                tags: {
                    connect: validatedTagIds.map(id => ({ id }))
                }
            }
        })

        return { success: true, message: "Usuario creado con éxito. Ya puedes iniciar sesión." }

    } catch (error) {
        await Logger.error("Error creating user", "SERVER_ACTION", error);
        return { success: false, message: "Ocurrió un error inesperado al crear el usuario" }
    }
}