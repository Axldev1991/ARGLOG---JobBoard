"use server"

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { isProfileComplete } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { resend } from "@/lib/resend";
import { Logger } from "@/lib/logger";

export async function applyToJob(jobId: number) {
    const session = await getSession();

    if (!session) {
        return { error: "Debes iniciar sesión para postularte." };
    }

    // 1. Obtener usuario de la DB (para tener datos frescos)
    const user = await prisma.user.findUnique({
        where: { id: session.id }
    });

    // Verificamos el rol de la SESIÓN (que puede estar impersonada)
    // TODO: REMOVE FOR PRODUCTION (Strict DB check is safer)
    const activeRole = session.role;

    if (!user || (activeRole !== 'candidate' && activeRole !== 'admin')) {
        return { error: `Solo los candidatos pueden postularse (Tu rol actual: ${activeRole})` };
    }

    // 2. EL GATEKEEPER 👮: Verificar perfil completo
    if (!isProfileComplete(user)) {
        return { error: "Tu perfil está incompleto. Sube tu CV y completa tu info en el Dashboard." };
    }

    try {
        // 3. ¿Ya se postuló antes?
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

        // 4. CREAR POSTULACIÓN ✨
        await prisma.application.create({
            data: {
                userId: user.id,
                jobId: jobId
            }
        });

        // ENVIAR EMAIL 🚀
        if (job) {
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'castellanoaxl@gmail.com', // <--- CAMBIA ESTO POR TU EMAIL
                subject: `Nueva postulación: ${job.title}`,
                html: `<p>El usuario ${user.name} se postuló a ${job.title}</p>`
            });
        }

        // Refrescar para que se vea el botón de "Ya te postulaste" (lo haremos luego)
        revalidatePath("/");
        revalidatePath("/dashboard");

        return { success: true };

    } catch (error) {
        await Logger.error("Falló applyToJob", "SERVER_ACTION", error, { jobId, userId: user?.id });
        return { error: "Ocurrió un error inesperado. Inténtalo de nuevo." };
    }
}
