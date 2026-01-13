// --------------------------------------------------------------------------
// 🧠 SERVER ACTION: REGISTRO DE USUARIO
// --------------------------------------------------------------------------
// 1. Recibe formData del cliente.
// 2. Valida inputs básicos.
// 3. Hashea la contraseña con `bcryptjs` (Standard de seguridad).
// 4. Crea usuario en PostgreSQL via Prisma.
// --------------------------------------------------------------------------

import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"
import { redirect } from "next/navigation"

export async function registerUser(formData: FormData) {
    // 1. Convertir FormData a Objeto simple
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as string

    // 2. Validar que no falte nada (Basic)
    if (!name || !email || !password || !role) {
        console.log("Faltan datos")
        return
    }

    // 3. Crear el usuario en la DB
    // Await es clave: esperamos a la DB, y hasheamos la pass (10 rondas de seguridad)
    await prisma.user.create({
        data: {
            name,
            email,
            password: await hash(password, 10),
            role
        }
    })

    console.log("Usuario creado!")
    // 4. Redirigir al Login
    redirect("/login")
}