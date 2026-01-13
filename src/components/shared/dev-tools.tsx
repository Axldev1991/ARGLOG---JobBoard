import { getSession } from "@/lib/session"
import { prisma } from "@/lib/db"
import { DevToolsContent } from "./dev-tools-content";

export async function DevTools() {
    // 1. Obtener Sesión Actual
    const session = await getSession();
    if (!session) return null;

    // 2. CHECK REAL y SEGURO contra la base de datos
    const realUser = await prisma.user.findUnique({
        where: { id: session.id }
    });

    if (realUser?.role !== 'dev') {
        return null; // Si no eres Dev real, no ves nada
    }

    // Pasamos el rol ACTUAL de la sesión (para marcar con el puntito verde cuál está activo)
    return <DevToolsContent role={session.role} />;
}