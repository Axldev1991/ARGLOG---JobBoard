"use server"
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function createJob(formData: FormData){
    const title = formData.get("title") as string;
    const salary = formData.get("salary") as string;
    const description = formData.get("description") as string;

    const cookieStore = await cookies();
    const sessionString = cookieStore.get("user_session")?.value;

    if (!sessionString) {
        redirect("/")
        return; 
    }

    const user = JSON.parse(sessionString);

    await prisma.job.create({
        data:{
            title: title,
            salary: salary,
            description: description,
            authorId: user.id
        }
    })

    redirect("/")
}