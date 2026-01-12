"use server"

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateJob(formData: FormData) {
    const user = await getSession();
    if (!user) redirect("/login");

    const jobId = formData.get("jobId") as string;
    const title = formData.get("title") as string;
    const salary = formData.get("salary") as string;
    const description = formData.get("description") as string;
    
    // Verificamos propiedad de nuevo por seguridad
    const existingJob = await prisma.job.findUnique({ where: { id: parseInt(jobId) } });
    if (!existingJob || existingJob.authorId !== user.id) {
        throw new Error("No autorizado");
    }

    await prisma.job.update({
        where: { id: parseInt(jobId) },
        data: {
            title,
            salary,
            description
        }
    });

    revalidatePath("/dashboard");
    revalidatePath(`/jobs/${jobId}`);
    redirect("/dashboard");
}