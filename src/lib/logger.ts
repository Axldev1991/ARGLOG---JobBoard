import { prisma } from "@/lib/db";

type LogLevel = "ERROR" | "WARN" | "INFO";
type LogSource = "SERVER_ACTION" | "MIDDLEWARE" | "API" | "CRON" | "UNKNOWN";

interface LogMetadata {
    [key: string]: any;
}

/**
 * Sistema de Logging Centralizado (In-House)
 * Guarda errores en la base de datos para depuración post-mortem.
 */
class LoggerService {

    /**
     * Registra un error crítico.
     * @param message Mensaje corto descriptivo.
     * @param source Origen del error (Server Action, etc).
     * @param error Objeto de error original (para stack trace).
     * @param metadata Datos extra (userId, input params).
     */
    async error(
        message: string,
        source: LogSource = "UNKNOWN",
        error?: unknown,
        metadata?: LogMetadata
    ) {
        await this.log("ERROR", message, source, error, metadata);
    }

    /**
     * Registra una advertencia (algo que no rompió la app, pero es raro).
     */
    async warn(
        message: string,
        source: LogSource = "UNKNOWN",
        metadata?: LogMetadata
    ) {
        await this.log("WARN", message, source, undefined, metadata);
    }

    // --- INTERNAL ---

    private async log(
        level: LogLevel,
        message: string,
        source: LogSource,
        error?: unknown,
        metadata?: LogMetadata
    ) {
        // 1. Siempre mostrar en consola local para desarrollo
        if (process.env.NODE_ENV !== "production") {
            const color = level === "ERROR" ? "\x1b[31m" : "\x1b[33m"; // Red or Yellow
            const reset = "\x1b[0m";
            console.log(`${color}[${level}] [${source}] ${message}${reset}`, error || "");
        }

        // 2. Preparar payload de error
        let errorData: any = {};
        if (error instanceof Error) {
            errorData = {
                name: error.name,
                message: error.message,
                stack: error.stack,
                cause: error.cause,
            };
        } else if (typeof error === "object") {
            errorData = error;
        } else if (typeof error === "string") {
            errorData = { message: error };
        }

        // 3. Guardar en BD (Fail-Safe: Si falla el log, no rompemos la app)
        try {
            await prisma.systemLog.create({
                data: {
                    level,
                    source,
                    message,
                    metadata: {
                        ...metadata,
                        error: Object.keys(errorData).length > 0 ? errorData : undefined,
                    },
                },
            });
        } catch (loggingError) {
            // Si falla BBDD, fallback a consola stderr
            console.error("🚨 CRITICAL: Logger Failed to write to DB", loggingError);
        }
    }
}

export const Logger = new LoggerService();
