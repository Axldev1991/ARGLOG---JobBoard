import { PrismaClient } from "@prisma/client";
import { MIS_TAGS } from "./data";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Sembrando tags...");

    // 1. Recorremos la lista que importamos de data.ts
    for (const tag of MIS_TAGS) {

        // 2. Preguntamos a la base de datos: "¿Conoces este nombre?"
        const existe = await prisma.tag.findUnique({
            where: { name: tag.name }
        });

        // 3. Si la respuesta es NO (es null), entonces lo creamos
        if (!existe) {
            await prisma.tag.create({
                data: tag
            });
            console.log("✅ Se creó: " + tag.name);
        } else {
            console.log("⚠️ Ya existe: " + tag.name);
        }
    }

    console.log("🏁 Listo! Base de datos sembrada.");
}

main(); // Llamamos a la función