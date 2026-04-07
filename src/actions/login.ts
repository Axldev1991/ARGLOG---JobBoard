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
    const identifier = formData.get("email") as string
    const password = formData.get("password") as string


    if (!identifier || !password) {
        return { error: "Todos los campos son obligatorios" }
    }

    try {
        let usuarioEncontrado;

        // 🧠 Clasificación Inteligente del Identificador
        if (identifier.includes("@")) {
            // Caso 1: Es un Email
            usuarioEncontrado = await prisma.user.findUnique({
                where: { email: identifier }
            })
        } else {
            // Caso 2: Es un CUIT (Normalización de números)
            const cleanCuit = identifier.replace(/[^0-9]/g, "");
            
            if (cleanCuit.length === 11) {
                const companyProfile = await prisma.companyProfile.findUnique({
                    where: { cuit: cleanCuit },
                    include: { user: true }
                });
                usuarioEncontrado = companyProfile?.user;
            }
        }

        // Usamos el mismo error para evitar revelación de información
        if (!usuarioEncontrado) {
            return { error: "Credenciales incorrectas" }
        }

        const passwordEsCorrecta = await compare(password, usuarioEncontrado.password)

        if (!passwordEsCorrecta) {
            return { error: "Credenciales incorrectas" }
        }

        // Verificar status para empresas
        if (usuarioEncontrado.role === "company" && usuarioEncontrado.status === "PENDING") {
            return { error: "Tu cuenta está en revisión. Un administrador debe aprobar tu solicitud." }
        }

        if (usuarioEncontrado.role === "company" && usuarioEncontrado.status === "REJECTED") {
            return { error: "Tu solicitud de registro fue rechazada. Contacta al administrador." }
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
        await Logger.error("Error en Login", "SERVER_ACTION", error, { identifier });
        return { error: "Error interno del servidor" }
    }
}