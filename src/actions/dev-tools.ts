"use server"

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

    // 🍪 Manipulación de Cookie
    // Sobrescribimos la cookie con los datos reales PERO con el rol falso
    (await cookies()).set("user_session", JSON.stringify({
        id: realUser.id,
        name: realUser.name,
        role: newRole // <--- AQUÍ ESTÁ EL TRUCO
    }));

    // Redirigimos a la ruta donde estaba el usuario
    redirect(currentPath);
}
