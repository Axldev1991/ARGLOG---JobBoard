"use server"

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { isProfileComplete } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { Logger } from "@/lib/logger";
import { ApplyJobSchema } from "@/lib/schemas";
import { sendEmail } from "@/lib/email";
import { ActionResponse } from "@/lib/actions"

/**
 * Server action for a candidate to apply to a job posting.
 */
export async function applyToJob(jobId: number): Promise<ActionResponse> {
    // 1. Auth Check (Iron Dome RBAC)
    const session = await requireRole(['candidate', 'admin']);

    // 🧠 VALIDACIÓN DE DATOS (ZOD)
    const validated = ApplyJobSchema.safeParse({ jobId });
    if (!validated.success) {
        return { success: false, message: "ID de oferta inválido" };
    }

    // 2. Obtener usuario de la DB (para tener datos frescos y verificar perfil)
    const user = await prisma.user.findUnique({
        where: { id: session.id }
    });

    if (!user) return { success: false, message: "Usuario no encontrado" };

    // 3. EL GATEKEEPER 👮: Verificar perfil completo
    if (!isProfileComplete(user)) {
        return { success: false, message: "Tu perfil está incompleto. Sube tu CV y completa tu info en el Dashboard." };
    }

    try {
        // 4. ¿Ya se postuló antes?
        const existingApplication = await prisma.application.findUnique({
            where: {
                userId_jobId: {
                    userId: user.id,
                    jobId: jobId
                }
            }
        });

        if (existingApplication) {
            return { success: false, message: "Ya te has postulado a esta oferta anteriormente." };
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: { author: true }
        });

        if (!job) {
            return { success: false, message: "La oferta no existe." };
        }

        if (job.status !== 'PUBLISHED') {
            return { success: false, message: "Esta oferta ya no está recibiendo postulaciones." };
        }

        if (job.expiresAt && new Date(job.expiresAt) < new Date()) {
            return { success: false, message: "Esta oferta ha expirado y ya no recibe postulaciones." };
        }

        // 5. CREAR POSTULACIÓN ✨
        await prisma.application.create({
            data: {
                userId: user.id,
                jobId: jobId
            }
        });

        // ENVIAR EMAILS 🚀 (Iron Dome)
        if (job && job.author.email) {
            try {
                // 1. Notificar a la Empresa
                await sendEmail({
                    to: job.author.email,
                    subject: `Nueva postulación: ${job.title}`,
                    html: `
                        <h1>¡Tienes una nueva postulación!</h1>
                        <p>El candidato <strong>${user.name}</strong> se ha postulado para la posición de <strong>${job.title}</strong>.</p>
                        <p>Puedes revisar su perfil y CV ingresando al panel de ArLog Jobs.</p>
                        <a href="https://www.arlogjobs.org/dashboard" class="button">Ir al Dashboard</a>
                    `
                });

                // 2. Confirmar al Candidato
                if (user.email) {
                    await sendEmail({
                        to: user.email,
                        subject: `Postulación enviada: ${job.title}`,
                        html: `
                            <h1>¡Hola ${user.name}!</h1>
                            <p>Tu postulación para <strong>${job.title}</strong> ha sido enviada correctamente a la empresa.</p>
                            <p>Te avisaremos por este medio si hay novedades sobre tu proceso.</p>
                            <p>¡Muchos éxitos!</p>
                            <a href="https://www.arlogjobs.org/dashboard" class="button">Ver mis postulaciones</a>
                        `
                    });
                }
            } catch (e) {
                await Logger.error("Error enviando notificaciones de postulación", "SERVER_ACTION", e, { jobId, userId: user.id });
            }
        }

        revalidatePath("/");
        revalidatePath("/dashboard");

        return { success: true, message: "¡Postulación enviada con éxito!" };

    } catch (error) {
        await Logger.error("Falló applyToJob", "SERVER_ACTION", error, { jobId, userId: user?.id });
        return { success: false, message: "Ocurrió un error inesperado. Inténtalo de nuevo." };
    }
}
