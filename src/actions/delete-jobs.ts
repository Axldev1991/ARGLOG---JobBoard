"use server"

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteJob(formData: FormData) {
    
    // 1. ¿Quién eres?
    const user = await getSession();
    if (!user) return;

    // 2. ¿Qué quieres borrar?
    const jobId = formData.get("jobId") as string;
    if (!jobId) return;

    // 3. SEGURIDAD: ¿Esta oferta es TUYA?
    // Buscamos la oferta primero
    const job = await prisma.job.findUnique({
        where: { id: parseInt(jobId) }
    });

    // Si no existe o el dueño no eres tú... ¡ALTO!
    if (!job || job.authorId !== user.id) {
        throw new Error("No tienes permiso para borrar esto.");
    }

    // 4. ¡Bórralo!
    await prisma.job.delete({
        where: { id: parseInt(jobId) }
    });

    // 5. Actualiza la pantalla
    revalidatePath("/dashboard");
    revalidatePath("/"); // Para que desaparezca del home también
}