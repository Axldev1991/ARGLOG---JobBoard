import { PrismaClient } from "@prisma/client";
import { MIS_TAGS } from "./data";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Sembrando tags...");

    // 0. Limpiamos las tags anteriores para empezar de cero según pedido del cliente
    await prisma.tag.deleteMany({});
    console.log("🗑️  Tags anteriores eliminadas.");

    // 1. Recorremos la lista que importamos de data.ts
    for (const tag of MIS_TAGS) {
        await prisma.tag.create({
            data: tag
        });
        console.log("✅ Se creó: " + tag.name);
    }

    console.log("🏁 Listo! Base de datos sembrada.");
}

main(); // Llamamos a la función