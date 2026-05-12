"use server"

import { prisma } from "@/lib/db"
import { compare } from "bcryptjs"
import { cookies } from "next/headers"
import { Logger } from "@/lib/logger"
import { signJWT } from "@/lib/auth"
import { LoginSchema } from "@/lib/schemas"
import { formatZodErrors, ActionResponse } from "@/lib/actions"

export async function loginUser(prevState: any, formData: FormData): Promise<ActionResponse> {
    const rawData = Object.fromEntries(formData.entries());
    const validated = LoginSchema.safeParse(rawData);

    if (!validated.success) {
        return { 
            success: false, 
            message: "Datos de login inválidos", 
            errors: formatZodErrors(validated.error) 
        };
    }

    const { identifier, password } = validated.data;

    try {
        let usuarioEncontrado;

        // 🧠 Identificación Secuencial (Email -> CUIT)
        // Primero intentamos por email exacto (cubre admin y emails reales)
        usuarioEncontrado = await prisma.user.findUnique({
            where: { email: identifier }
        });

        // Si no se encuentra, intentamos extraer un CUIT del identificador
        if (!usuarioEncontrado) {
            const cleanCuit = identifier.replace(/[^0-9]/g, "");
            if (cleanCuit.length === 11) {
                const companyProfile = await prisma.companyProfile.findUnique({
                    where: { cuit: cleanCuit },
                    include: { user: true }
                });
                usuarioEncontrado = companyProfile?.user;
            }
        }

        if (!usuarioEncontrado) {
            return { success: false, message: "Credenciales incorrectas" }
        }

        const passwordEsCorrecta = await compare(password, usuarioEncontrado.password)

        if (!passwordEsCorrecta) {
            return { success: false, message: "Credenciales incorrectas" }
        }

        if (usuarioEncontrado.role === "company" && usuarioEncontrado.status === "PENDING") {
            return { success: false, message: "Tu cuenta está en revisión por un administrador." }
        }

        if (usuarioEncontrado.role === "company" && usuarioEncontrado.status === "REJECTED") {
            return { success: false, message: "Tu solicitud de registro fue rechazada." }
        }

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

        return { success: true, message: "Sesión iniciada correctamente" }
    } catch (error) {
        await Logger.error("Error en Login", "SERVER_ACTION", error, { identifier });
        return { success: false, message: "Error interno del servidor" }
    }
}