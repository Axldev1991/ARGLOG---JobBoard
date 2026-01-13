
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetResume() {
    const email = 'castellanoaxl@gmail.com' // Tu email

    await prisma.user.update({
        where: { email: email },
        data: { resumeUrl: null } // <--- Borramos la URL
    })

    console.log(`✅ CV reseteado para ${email}`)
}

resetResume()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
