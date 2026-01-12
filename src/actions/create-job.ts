"use server"
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export async function createJob(formData: FormData) {
    const title = formData.get("title") as string;
    const salary = formData.get("salary") as string;
    const description = formData.get("description") as string;

    const user = await getSession();
    if (!user) {
        redirect("/login");
    }

    await prisma.job.create({
        data: {
            title: title,
            salary: salary,
            description: description,
            authorId: user.id
        }
    })

    redirect("/")
}