"use server"

import { prisma } from "@/lib/db"
import { getSession } from "@/lib/session"
import { compare, hash } from "bcryptjs"
import { Logger } from "@/lib/logger"
import { UpdatePasswordSchema } from "@/lib/schemas"

/**
 * Server action to update a user's password securely.
 */
export async function updatePassword(formData: FormData) {
    const session = await getSession();

    if (!session || !session.id) {
        return { error: "No autenticado" };
    }

    // 🧠 VALIDACIÓN DE DATOS (ZOD)
    const rawData = {
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
    };

    const validated = UpdatePasswordSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: "Datos de contraseña inválidos", details: validated.error.flatten() };
    }

    const { currentPassword, newPassword } = validated.data;

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
