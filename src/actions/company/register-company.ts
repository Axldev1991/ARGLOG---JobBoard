"use server"

import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"
import { Logger } from "@/lib/logger"
import { RegisterCompanySchema } from "@/lib/schemas"
import { sendEmail } from "@/lib/email"

export async function registerCompany(formData: FormData) {
    // 🧠 VALIDACIÓN DE DATOS (ZOD)
    const rawData = {
        legalName: formData.get("legalName"),
        email: formData.get("email"),
        password: formData.get("password"),
        industry: formData.get("industry") || "Logística",
        cuit: formData.get("cuit"),
    };

    const validated = RegisterCompanySchema.safeParse(rawData);

    if (!validated.success) {
        return { error: "Datos de registro inválidos", details: validated.error.flatten() };
    }

    const { legalName, email, password, industry, cuit } = validated.data;

    try {

        // 3. Verificar que el email no exista
        const existingEmail = await prisma.user.findUnique({
            where: { email }
        })

        if (existingEmail) {
            return { error: "Este email ya está registrado" }
        }

        // 4. Verificar que el CUIT no exista
        const existingCuit = await prisma.companyProfile.findUnique({
            where: { cuit }
        })

        if (existingCuit) {
            return { error: "Este CUIT ya está registrado" }
        }

        // 5. Crear usuario con status PENDING y CompanyProfile
        const hashedPassword = await hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                name: legalName,
                email,
                password: hashedPassword,
                role: "company",
                status: "PENDING",
                companyProfile: {
                    create: {
                        legalName,
                        industry,
                        cuit,
                    }
                }
            },
            include: {
                companyProfile: true
            }
        })

        // 6. Enviar email al admin (Iron Dome)
        try {
            await sendEmail({
                to: "admin@arlog.org",
                subject: "Nueva solicitud de registro - Empresa",
                html: `
                    <h1>Nueva solicitud de registro</h1>
                    <p>Una empresa ha solicitado unirse a ArLog Jobs.</p>
                    <hr />
                    <h2>Datos de la empresa:</h2>
                    <ul>
                        <li><strong>Razón Social:</strong> ${legalName}</li>
                        <li><strong>CUIT:</strong> ${cuit}</li>
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Industria:</strong> ${industry}</li>
                    </ul>
                    <hr />
                    <p>Para aprobar o rechazar esta solicitud, ingresa al panel de administración.</p>
                    <a href="https://www.arlogjobs.org/admin" class="button">Ir al Panel Admin</a>
                `
            })
        } catch (emailError) {
            await Logger.error("Failed to send admin notification email", "SERVER_ACTION", emailError);
        }

        await Logger.warn(
            "Company registration request created",
            "SERVER_ACTION",
            { userId: newUser.id, email, legalName }
        )

        return { 
            success: true, 
            message: "Tu solicitud de registro ha sido enviada. Un administrador revisará tu información y te notificará por email." 
        }

    } catch (error) {
        await Logger.error("Error registering company", "SERVER_ACTION", error)
        return { error: "Error al procesar el registro" }
    }
}