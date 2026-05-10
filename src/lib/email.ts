import { resend } from "@/lib/resend";
import { env } from "./env";
import { Logger } from "./logger";

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

/**
 * Servicio centralizado para el envío de correos electrónicos.
 * Envuelve el contenido en un template HTML premium con la marca ArLog.
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions) {
    const from = env.RESEND_FROM || "ArLog Jobs <noreply@arlogjobs.org>";

    const emailHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background-color: #0a0a0a;
                color: #ffffff;
                margin: 0;
                padding: 0;
                -webkit-font-smoothing: antialiased;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 20px;
            }
            .header {
                text-align: center;
                margin-bottom: 40px;
            }
            .logo {
                height: 40px;
                width: auto;
            }
            .content {
                background-color: #141414;
                border: 1px solid #262626;
                border-radius: 12px;
                padding: 32px;
                line-height: 1.6;
                font-size: 16px;
                color: #e5e5e5;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                font-size: 12px;
                color: #737373;
            }
            .footer a {
                color: #a3a3a3;
                text-decoration: none;
                margin: 0 10px;
            }
            h1, h2, h3 {
                color: #ffffff;
                margin-top: 0;
            }
            .button {
                display: inline-block;
                background-color: #ffffff;
                color: #000000;
                padding: 12px 24px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                margin-top: 20px;
            }
            hr {
                border: 0;
                border-top: 1px solid #262626;
                margin: 24px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <!-- Nota: En producción, reemplazar con la URL absoluta del logo alojado -->
                <h2 style="margin: 0; letter-spacing: -0.025em; font-weight: 800;">ARLOG <span style="color: #737373;">JOBS</span></h2>
            </div>
            
            <div class="content">
                ${html}
            </div>
            
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} ArLog Jobs. Todos los derechos reservados.</p>
                <p>
                    <a href="https://www.arlogjobs.org/">Sitio Web</a>
                    <a href="https://www.arlogjobs.org/contacto">Soporte</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const result = await resend.emails.send({
            from,
            to,
            subject,
            html: emailHtml,
        });

        return { success: true, id: result.data?.id };
    } catch (error) {
        console.error("Error enviando email via Resend Service:", error);
        return { success: false, error };
    }
}
