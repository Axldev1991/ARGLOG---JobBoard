"use server"
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Logger } from "@/lib/logger";

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

    try {
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
    } catch (error) {
        await Logger.error("Falló createJob", "SERVER_ACTION", error, { userId: user.id, title });
        // NOTE: Como usamos redirect, no podemos hacer return normal aquí a menos que cambiemos la estructura.
        // Pero redirect lanzá un "NEXT_REDIRECT" error que NO debemos capturar, o debemos relanzar.
        // Prisma error sí lo capturamos.
        // Mejor approach: Catch general loguea y relanza si no es conocido, o redirige a error page.
        // Para simplificar: Logueamos y lanzamos error para que la UI lo maneje (o Next error boundary).
        throw error;
    }

    redirect("/dashboard")
}