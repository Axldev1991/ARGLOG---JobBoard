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
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #f9fafb;
                color: #111827;
                margin: 0;
                padding: 0;
            }
            .wrapper {
                background-color: #f9fafb;
                padding: 48px 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .header {
                padding: 32px 40px;
                border-bottom: 1px solid #f3f4f6;
                background-color: #ffffff;
            }
            .content {
                padding: 40px;
                line-height: 1.6;
                font-size: 16px;
                color: #374151;
            }
            .footer {
                padding: 32px 40px;
                background-color: #f9fafb;
                border-top: 1px solid #f3f4f6;
                text-align: center;
                font-size: 13px;
                color: #6b7280;
            }
            .footer a {
                color: #4b5563;
                text-decoration: underline;
                margin: 0 8px;
            }
            h1, h2, h3 {
                color: #111827;
                margin-top: 0;
                font-weight: 600;
            }
            .button {
                display: inline-block;
                background-color: #111827;
                color: #ffffff !important;
                padding: 12px 24px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 500;
                margin-top: 24px;
            }
            .secondary-text {
                color: #6b7280;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="container">
                <div class="header">
                    <div style="font-size: 18px; font-weight: 700; letter-spacing: -0.02em; color: #111827;">
                        ARLOG <span style="color: #6b7280; font-weight: 400;">JOBS</span>
                    </div>
                </div>
                
                <div class="content">
                    ${html}
                </div>
                
                <div class="footer">
                    <p style="margin-bottom: 8px;">&copy; ${new Date().getFullYear()} ArLog Jobs. Plataforma Profesional Logística.</p>
                    <p>
                        <a href="https://www.arlogjobs.org/">Sitio Web</a>
                        <span style="color: #d1d5db;">&bull;</span>
                        <a href="https://www.arlogjobs.org/contacto">Soporte</a>
                    </p>
                </div>
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
