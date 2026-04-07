"use server"

import { prisma } from "@/lib/db"
import { getSession } from "@/lib/session"
import { Logger } from "@/lib/logger"
import { Resend } from "resend"

export async function rejectCompany(userId: number, reason?: string) {
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

        // 3. Rechazar usuario
        await prisma.user.update({
            where: { id: userId },
            data: { status: "REJECTED" }
        })

        // 4. Enviar email de rechazo
        try {
            const resend = new Resend(process.env.RESEND_API_KEY)
            
            const reasonText = reason ? `<p><strong>Motivo:</strong> ${reason}</p>` : ""
            
            await resend.emails.send({
                from: "ArLog Jobs <onboarding@resend.dev>",
                to: user.email,
                subject: "Tu registro en ArLog Jobs ha sido rechazado",
                html: `
                    <h1>Registro rechazado</h1>
                    <p>Lamentamos informarte que tu solicitud de registro en ArLog Jobs ha sido <strong>rechazada</strong>.</p>
                    ${reasonText}
                    <p>Si tienes alguna consulta, puedes contactarnos.</p>
                `
            })
        } catch (emailError) {
            await Logger.error(
                "Failed to send rejection email",
                "SERVER_ACTION",
                emailError,
                { userId }
            )
        }

        await Logger.warn(
            "Company rejected",
            "SERVER_ACTION",
            { userId, rejectedBy: session.id, reason }
        )

        return { success: true, message: "Empresa rechazada correctamente" }

    } catch (error) {
        await Logger.error("Error rejecting company", "SERVER_ACTION", error, { userId })
        return { error: "Error al rechazar la empresa" }
    }
}