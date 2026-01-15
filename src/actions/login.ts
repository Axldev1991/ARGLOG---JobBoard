"use server"

// --------------------------------------------------------------------------
// 🧠 SERVER ACTION: LOGIN DE USUARIO
// --------------------------------------------------------------------------
// Este archivo maneja la autenticación segura en el servidor.
// 1. Verifica si el email existe.
// 2. Compara el password hasheado usando `bcryptjs`.
// 3. Crea una sesión simple basada en cookies (JWT o JSON).
// --------------------------------------------------------------------------

import { prisma } from "@/lib/db"
import { compare } from "bcryptjs"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { Logger } from "@/lib/logger"

export async function loginUser(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string


    if (!email || !password) {
        return { error: "Todos los campos son obligatorios" }
    }

    try {
        const usuarioEncontrado = await prisma.user.findUnique({
            where: { email }
        })

        // Usamos el mismo error para ambos casos por seguridad
        if (!usuarioEncontrado) {
            return { error: "Credenciales incorrectas" }
        }

        const passwordEsCorrecta = await compare(password, usuarioEncontrado.password)

        if (!passwordEsCorrecta) {
            return { error: "Credenciales incorrectas" }
        }

        // TODO: Aquí deberías setear la cookie de sesión (ej. con jose o NextAuth)
        // cookies().set("session", token)
        (await cookies()).set("user_session", JSON.stringify({
            id: usuarioEncontrado.id,
            name: usuarioEncontrado.name,
            role: usuarioEncontrado.role
        }));

        // redirect("/") <-- Lo quitamos para manejarlo en el cliente
        return { success: true }
    } catch (error) {
        await Logger.error("Error en Login", "SERVER_ACTION", error, { email });
        return { error: "Error interno del servidor" }
    }
}