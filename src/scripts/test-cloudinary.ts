import { config } from 'dotenv';
config(); // Cargar .env manualmente
import cloudinary from "../lib/cloudinary";

async function main() {
    console.log("🔍 Probando configuración de Cloudinary...");
    console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ Configurado" : "❌ FALTANTE");
    console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "✅ Configurado" : "❌ FALTANTE");
    console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "✅ Configurado" : "❌ FALTANTE");

    try {
        console.log("📤 Intentando subir un archivo de prueba...");

        // Creamos un buffer falso (como un archivo de texto simple)
        const buffer = Buffer.from("Hola, esto es una prueba de conexión.", "utf-8");

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw", // Usamos RAW que es lo que queremos para PDFs
                    folder: "test_debug",
                    public_id: "test_conectividad"
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        console.log("✅ ¡ÉXITO! Conexión funciona.");
        console.log(result);

    } catch (error) {
        console.error("❌ ERROR FATAL DE CONEXIÓN:");
        console.error(error);
    }
}

main();
