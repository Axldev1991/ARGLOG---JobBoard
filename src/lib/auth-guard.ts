import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

/**
 * Verifica si el usuario actual tiene permisos de Administrador o Developer.
 * Lanza un error si no está autorizado (para usar en Server Actions).
 */
export async function requireAdminAction() {
    const session = await getSession();

    if (!session) {
        throw new Error("⛔ No autenticado.");
    }

    if (session.role !== 'admin' && session.role !== 'dev') {
        throw new Error("⛔ Acceso denegado: Se requieren permisos de Administrador.");
    }

    return session;
}

/**
 * Verifica permisos para Componentes/Páginas.
 * Redirige al login o a home si no está autorizado.
 */
export async function protectAdminRoute() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    if (session.role !== 'admin' && session.role !== 'dev') {
        // Si está logueado pero no es admin, lo mandamos a su dashboard normal
        redirect("/dashboard");
    }

    return session;
}
