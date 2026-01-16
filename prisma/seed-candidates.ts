
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando siembra de candidatos...');
    if (!process.env.SEED_CANDIDATE_PASSWORD) throw new Error("SEED_CANDIDATE_PASSWORD must be set in .env");

    // 1. Obtener todas las ofertas existentes para postularse
    const jobs = await prisma.job.findMany();
    if (jobs.length === 0) {
        console.error('❌ No hay ofertas de trabajo. Crea algunas ofertas primero.');
        return;
    }

    // Datos fake variados
    const candidatesData = [
        { name: "Ana García", email: "ana.garcia@example.com", headline: "Senior Frontend Developer", bio: "Apasionada por React y UX/UI." },
        { name: "Carlos López", email: "carlos.lopez@example.com", headline: "Fullstack Engineer", bio: "Experto en Node.js y bases de datos SQL." },
        { name: "Lucía Mendez", email: "lucia.mendez@example.com", headline: "UX Researcher", bio: "Enfocada en la experiencia de usuario y accesibilidad." },
        { name: "Jorge Perez", email: "jorge.perez@example.com", headline: "Project Manager", bio: "Certificado PMP con 5 años de experiencia." },
        { name: "Sofía Ruiz", email: "sofia.ruiz@example.com", headline: "QA Automation", bio: "Especialista en Cypress y Playwright." },
        { name: "Miguel Angel", email: "miguel.angel@example.com", headline: "DevOps Engineer", bio: "Kubernetes y Docker son mi día a día." },
        { name: "Elena Torres", email: "elena.torres@example.com", headline: "Product Designer", bio: "Diseñando productos digitales que la gente ama." },
        { name: "David Fernandez", email: "david.fernandez@example.com", headline: "Backend Developer", bio: "Go y Python lover." },
        { name: "Maria Rodriguez", email: "maria.rodriguez@example.com", headline: "HR Specialist", bio: "Buscando el mejor talento humano." },
        { name: "Pedro Gomez", email: "pedro.gomez@example.com", headline: "Marketing Digital", bio: "SEO/SEM y estrategias de crecimiento." },
    ];

    for (const data of candidatesData) {
        // 2. Crear o actualizar usuario (upsert para no fallar si vuelves a correr el script)
        const user = await prisma.user.upsert({
            where: { email: data.email },
            update: {},
            create: {
                email: data.email,
                name: data.name,
                password: process.env.SEED_CANDIDATE_PASSWORD,
                role: "candidate",
                headline: data.headline,
                bio: data.bio,
                city: "Buenos Aires, AR", // Fake location
            },
        });

        console.log(`👤 Candidato procesado: ${user.name}`);

        // 3. Postularse aleatoriamente a 1-3 trabajos
        const randomJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);

        for (const job of randomJobs) {
            try {
                await prisma.application.create({
                    data: {
                        userId: user.id,
                        jobId: job.id,
                        status: Math.random() > 0.8 ? 'REJECTED' : (Math.random() > 0.8 ? 'HIRED' : 'PENDING'), // Algunos con estado distinto
                    },
                });
                console.log(`   └─ Postulado a: ${job.title}`);
            } catch (e) {
                // Ignorar si ya existe la postulación (unique constraint)
            }
        }
    }

    console.log('✅ Siembra finalizada con éxito.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
