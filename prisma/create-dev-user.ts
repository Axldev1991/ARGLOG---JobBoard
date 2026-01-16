import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'castellanoaxl@gmail.com'
    const password = process.env.DEV_USER_PASSWORD; // Default password, change it after logging in!
    if (!password) throw new Error("DEV_USER_PASSWORD must be set in .env");

    console.log(`🛡️  Creating Super Admin: ${email}...`)

    // 1. Check if exists
    const existing = await prisma.user.findUnique({
        where: { email }
    })

    if (existing) {
        console.log('⚠️  User already exists. Updating role to DEV...')
        await prisma.user.update({
            where: { email },
            data: { role: 'dev' }
        })
        console.log('✅ Role updated.')
        return
    }

    // 2. Create if not exists
    const hashedPassword = await hash(password, 10)

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: 'Axel Castellano',
            role: 'dev',
            headline: 'Lead Developer',
            city: 'Buenos Aires'
        }
    })

    console.log(`✅ Super Admin created successfully.`)
    console.log(`🔑 Credentials: ${email} / ${password}`)
    console.log('👉 Please change your password immediately after login.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
