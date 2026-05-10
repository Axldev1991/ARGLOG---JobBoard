"use server"

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signJWT, SessionPayload } from "@/lib/auth";

export async function impersonateRole(newRole: string, currentPath: string = "/dashboard") {
    const session = await getSession();
    if (!session) return;

    // 🔐 SEGURIDAD: Doble check contra la DB real
    // Nadie puede impersonar a menos que su usuario real en la DB sea 'dev'
    const realUser = await prisma.user.findUnique({
        where: { id: session.id }
    });

    if (realUser?.role !== 'dev') {
        throw new Error("⛔ ACCESO DENEGADO: No tienes permisos de Super Admin.");
    }

    console.log(`🕵️ DEV MODE: Cambiando rol de sesión a [${newRole}] manteniendo ruta [${currentPath}]`);

    // 🍪 Generar JWT válido con el nuevo rol
    const token = await signJWT({
        id: realUser.id,
        name: realUser.name,
        role: newRole as SessionPayload["role"]
    });

    // Sobrescribimos la cookie con el token firmado
    (await cookies()).set("user_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 2 // 2 horas
    });

    // Redirigimos a la ruta donde estaba el usuario
    redirect(currentPath);
}
