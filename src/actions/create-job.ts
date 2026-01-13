"use server"
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export async function createJob(formData: FormData) {
    const title = formData.get("title") as string;
    const salary = formData.get("salary") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const modality = formData.get("modality") as string;
    const location = formData.get("location") as string;
    const tagsJson = formData.get("tags") as string;
    const tagIds = JSON.parse(tagsJson || "[]");

    const user = await getSession();
    if (!user) {
        redirect("/login");
    }

    await prisma.job.create({
        data: {
            title,
            description,
            salary,
            category,
            modality,
            location,
            authorId: user.id,
            tags: {
                connect: tagIds.map((id: number) => ({ id: id }))
            }
        }
    })

    redirect("/dashboard")
}