"use server"
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

// --------------------------------------------------------------------------
// 🧠 SERVER ACTION: CREAR EMPLEO
// --------------------------------------------------------------------------
// Este archivo maneja la lógica de negocio para insertar una nueva oferta en la DB.
// Recibe un `FormData` directo del formulario HTML/React, lo que simplifica
// el manejo de inputs sin necesidad de estados complejos en el cliente (Controlled Components).
// --------------------------------------------------------------------------

export async function createJob(formData: FormData) {
    // Extracción de datos (en app real usaríamos Zod para validar aquí)
    const title = formData.get("title") as string;
    const salary = formData.get("salary") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const modality = formData.get("modality") as string;
    const location = formData.get("location") as string;

    // El JSON de tags viene del <input type="hidden"> que nuestro componente TagSelector llenó
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