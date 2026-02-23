"use server"

import { prisma } from "@/lib/db"
import { getSession } from "@/lib/session"
import { compare, hash } from "bcryptjs"
import { Logger } from "@/lib/logger"

/**
 * Server action to update a user's password securely.
 */
export async function updatePassword(formData: FormData) {
    const session = await getSession();

    if (!session || !session.id) {
        return { error: "No autenticado" };
    }

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { error: "Todos los campos son obligatorios" };
    }

    if (newPassword !== confirmPassword) {
        return { error: "Las contraseñas nuevas no coinciden" };
    }

    if (newPassword.length < 6) {
        return { error: "La nueva contraseña debe tener al menos 6 caracteres" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.id }
        });

        if (!user) {
            return { error: "Usuario no encontrado" };
        }

        const isPasswordCorrect = await compare(currentPassword, user.password);

        if (!isPasswordCorrect) {
            return { error: "Contraseña actual incorrecta" };
        }

        const newHashedPassword = await hash(newPassword, 10);

        await prisma.user.update({
            where: { id: session.id },
            data: { password: newHashedPassword }
        });

        return { success: true };
    } catch (error) {
        await Logger.error("Error updating password", "SERVER_ACTION", error, { userId: session.id });
        return { error: "Error interno del servidor al actualizar la contraseña" };
    }
}
