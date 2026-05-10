"use server"

import { prisma } from "@/lib/db"
import { getSession } from "@/lib/session"
import { Logger } from "@/lib/logger"
import { sendEmail } from "@/lib/email"

export async function approveCompany(userId: number) {
    try {
        // 1. Verificar que es admin
        const session = await getSession()
        
        if (!session || (session.role !== "admin" && session.role !== "dev")) {
            return { error: "No autorizado" }
        }

        // 2. Buscar usuario
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { companyProfile: true }
        })

        if (!user) {
            return { error: "Usuario no encontrado" }
        }

        if (user.role !== "company") {
            return { error: "El usuario no es una empresa" }
        }

        if (user.status !== "PENDING") {
            return { error: "La empresa no está pendiente de aprobación" }
        }

        // 3. Aprobar usuario
        await prisma.user.update({
            where: { id: userId },
            data: { status: "ACTIVE" }
        })

        // 4. Enviar email de aprobación (Iron Dome)
        try {
            await sendEmail({
                to: user.email,
                subject: "Tu registro en ArLog Jobs ha sido aprobado",
                html: `
                    <h1>¡Bienvenido a ArLog Jobs!</h1>
                    <p>Tu solicitud de registro ha sido <strong>aprobada</strong>.</p>
                    <p>Ahora puedes iniciar sesión y comenzar a publicar ofertas de empleo.</p>
                    <a href="https://www.arlogjobs.org/login" class="button">Iniciar Sesión</a>
                `
            })
        } catch (emailError) {
            await Logger.error("Failed to send approval email", "SERVER_ACTION", emailError, { userId });
        }

        await Logger.warn(
            "Company approved",
            "SERVER_ACTION",
            { userId, approvedBy: session.id }
        )

        return { success: true, message: "Empresa aprobada correctamente" }

    } catch (error) {
        await Logger.error("Error approving company", "SERVER_ACTION", error, { userId })
        return { error: "Error al aprobar la empresa" }
    }
}