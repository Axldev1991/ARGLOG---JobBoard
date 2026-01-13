
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // 1. Buscamos específicamente a Axel
    const user = await prisma.user.findUnique({
        where: { email: 'castellanoaxl@gmail.com' }
    });

    if (!user) {
        console.log("❌ No encontré al usuario castellanoaxl@gmail.com. Registrate primero.");
        return;
    }

    console.log(`🕵️ Encontré al usuario: ${user.email} con rol actual: ${user.role}`);

    // 2. Le actualizamos el rol a 'dev'
    // OJO: 'dev' es solo un string, nuestro sistema lo interpretará como "Super Admin"
    await prisma.user.update({
        where: { id: user.id },
        data: { role: 'dev' }
    });

    console.log(`✅ ¡Ascenso completado! Ahora ${user.email} es un 'dev' (Dios del sistema).`);
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
