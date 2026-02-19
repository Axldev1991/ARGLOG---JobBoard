"use server"

// --------------------------------------------------------------------------
// 🧠 SERVER ACTION: REGISTRO DE USUARIO
// --------------------------------------------------------------------------
// 1. Recibe formData del cliente.
// 2. Valida inputs básicos.
// 3. Hashea la contraseña con `bcryptjs` (Standard de seguridad).
// 4. Crea usuario en PostgreSQL via Prisma.
// --------------------------------------------------------------------------

import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"

export async function registerUser(formData: FormData) {
    try {
        // 1. Convertir FormData a Objeto simple
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const role = formData.get("role") as string

        // 2. Validar que no falte nada (Basic)
        if (!name || !email || !password || !role) {
            return { error: "Todos los campos son obligatorios" }
        }

        // 2.1 Verificar si ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: "Este email ya está registrado" }
        }

        // 3. Crear el usuario en la DB con sus tags
        const tagsJson = formData.get("tags") as string;
        const tagIds = JSON.parse(tagsJson || "[]") as number[];

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

        // 4. Retornar éxito en lugar de redirigir
        return { success: true }

    } catch (error) {
        console.error("Error creating user:", error);
        return { error: "Error al crear usuario" }
    }
}