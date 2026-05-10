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
import { cookies } from "next/headers"
import { Logger } from "@/lib/logger"
import { signJWT } from "@/lib/auth"
import { LoginSchema } from "@/lib/schemas"

export async function loginUser(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validated = LoginSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: "Datos de login inválidos" }
    }

    const { identifier, password } = validated.data;

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

        // 🧠 SETEO DE SESIÓN BLINDADA (JWT)
        const token = await signJWT({
            id: usuarioEncontrado.id,
            name: usuarioEncontrado.name,
            role: usuarioEncontrado.role as "candidate" | "company" | "admin" | "dev"
        });

        (await cookies()).set("user_session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        return { success: true }
    } catch (error) {
        await Logger.error("Error en Login", "SERVER_ACTION", error, { identifier });
        return { error: "Error interno del servidor" }
    }
}