
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        const updatedUser = await prisma.user.update({
            where: { email: 'castellanoaxl@gmail.com' },
            data: { role: 'candidate' }
        });
        console.log('✅ EXITO: Rol actualizado:', updatedUser.role);
    } catch (e) {
        console.error('❌ ERROR:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
