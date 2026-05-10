"use server"

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { isProfileComplete } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { resend } from "@/lib/resend";
import { Logger } from "@/lib/logger";
import { ApplyJobSchema } from "@/lib/schemas";

export async function applyToJob(jobId: number) {
    // 1. Auth Check (Iron Dome RBAC)
    const session = await requireRole(['candidate', 'admin']);

    // 🧠 VALIDACIÓN DE DATOS (ZOD)
    const validated = ApplyJobSchema.safeParse({ jobId });
    if (!validated.success) {
        return { error: "ID de oferta inválido" };
    }

    // 2. Obtener usuario de la DB (para tener datos frescos y verificar perfil)
    const user = await prisma.user.findUnique({
        where: { id: session.id }
    });

    if (!user) return { error: "Usuario no encontrado" };

    // 3. EL GATEKEEPER 👮: Verificar perfil completo
    if (!isProfileComplete(user)) {
        return { error: "Tu perfil está incompleto. Sube tu CV y completa tu info en el Dashboard." };
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
            return { error: "Ya te has postulado a esta oferta anteriormente." };
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: { author: true }
        });

        if (!job) {
            return { error: "La oferta no existe." };
        }

        if (job.status !== 'PUBLISHED') {
            return { error: "Esta oferta ya no está recibiendo postulaciones." };
        }

        if (job.expiresAt && new Date(job.expiresAt) < new Date()) {
            return { error: "Esta oferta ha expirado y ya no recibe postulaciones." };
        }

        // 5. CREAR POSTULACIÓN ✨
        await prisma.application.create({
            data: {
                userId: user.id,
                jobId: jobId
            }
        });

        // ENVIAR EMAIL 🚀
        if (job && job.author.email) {
            try {
                await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: job.author.email,
                    subject: `Nueva postulación: ${job.title}`,
                    html: `<p>El usuario ${user.name} se postuló a ${job.title}</p>`
                });
            } catch (e) {
                console.error("Error enviando email de postulación", e);
            }
        }

        revalidatePath("/");
        revalidatePath("/dashboard");

        return { success: true };

    } catch (error) {
        await Logger.error("Falló applyToJob", "SERVER_ACTION", error, { jobId, userId: user?.id });
        return { error: "Ocurrió un error inesperado. Inténtalo de nuevo." };
    }
}
