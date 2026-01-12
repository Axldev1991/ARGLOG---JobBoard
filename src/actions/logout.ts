"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
    const cookieStore = await cookies();
    
    // Destruimos la cookie poniendo fecha de expiración en el pasado
    cookieStore.set("user_session", "", { 
        expires: new Date(0) 
    });

    // Nos vamos al home
    redirect("/");
}