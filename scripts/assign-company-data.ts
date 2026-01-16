
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const targetEmail = 'castellanoaxl@gmail.com'; // El usuario objetivo

    console.log(`🔍 Buscando usuario: ${targetEmail}`);
    const user = await prisma.user.findUnique({
        where: { email: targetEmail }
    });

    if (!user) {
        console.error("❌ Usuario no encontrado. Crea la cuenta primero manualmente o via web.");
        return;
    }

    console.log(`✅ Usuario encontrado (ID: ${user.id}). Transformando en Empresa...`);

    // 1. Convertir en Empresa y Crear Perfil
    await prisma.user.update({
        where: { id: user.id },
        data: {
            role: 'company',
            companyProfile: {
                upsert: {
                    create: {
                        legalName: "Tech Solutions Inc.",
                        cuit: "30-12345678-9",
                        industry: "Software Factory",
                        website: "https://tech-solutions-demo.com",
                        description: "Somos una empresa líder en desarrollo de software logístico y soluciones cloud de alto rendimiento. Buscamos talento apasionado."
                    },
                    update: {} // Si ya existe, no hacemos nada
                }
            }
        }
    });

    console.log("🏢 Perfil de empresa asignado.");

    // 2. Crear Ofertas (Jobs)
    // Borramos ofertas viejas de este user para no duplicar en ejecuciones repetidas (Opcional, pero limpio)
    await prisma.job.deleteMany({ where: { authorId: user.id } });

    const tags = await prisma.tag.findMany(); // Necesitamos tags reales

    const jobsData = [
        {
            title: "Senior React Developer",
            description: "Buscamos un experto en React, Next.js y Tailwind para liderar nuestro equipo de frontend. Modalidad 100% remota con pago en USD.",
            salary: "$3000 - $4500 USD",
            category: "Desarrollo",
            modality: "Remoto",
            location: "Argentina (Remoto)",
            status: "PUBLISHED"
        },
        {
            title: "Logistics Manager",
            description: "Coordinación de flotas y optimización de rutas para nuestra división LATAM. Experiencia en SAP requerida.",
            salary: "$2500 USD",
            category: "Logística",
            modality: "Híbrido",
            location: "Buenos Aires, CABA",
            status: "PUBLISHED"
        },
        {
            title: "UX/UI Designer",
            description: "Diseño de interfaces intuitivas para sistemas complejos de gestión de stock.",
            salary: "$2000 - $2800 USD",
            category: "Diseño",
            modality: "Remoto",
            location: "Cualquier lugar",
            status: "PUBLISHED"
        }
    ];

    console.log("💼 Creando 3 ofertas de trabajo...");

    const createdJobs = [];
    for (const job of jobsData) {
        // Asignamos 2 o 3 random tags
        const randomTags = tags.sort(() => 0.5 - Math.random()).slice(0, 3);

        const newJob = await prisma.job.create({
            data: {
                ...job,
                authorId: user.id,
                tags: {
                    connect: randomTags.map(t => ({ id: t.id }))
                }
            }
        });
        createdJobs.push(newJob);
    }

    // 3. Crear Candidatos Falsos y Postularlos
    console.log("👥 Generando candidatos y postulaciones...");

    // Lista de candidatos dummy
    const candidatesData = [
        { name: "Juan Pérez", email: "juan.perez.demo@test.com", headline: "Fullstack Dev", role: "candidate" },
        { name: "Maria Garcia", email: "maria.garcia.demo@test.com", headline: "UX Specialist", role: "candidate" },
        { name: "Carlos Lopez", email: "carlos.lopez.demo@test.com", headline: "Logistics Operator", role: "candidate" },
        { name: "Ana Torres", email: "ana.torres.demo@test.com", headline: "Frontend Junior", role: "candidate" },
        { name: "Sofía Martínez", email: "sofia.martinez.demo@test.com", headline: "Product Manager", role: "candidate" }
    ];

    const placeholderPassword = process.env.SEED_CANDIDATE_PASSWORD || 'password123';
    const passwordHash = await hash(placeholderPassword, 10);

    for (const c of candidatesData) {
        // Upsert candidato
        const candidate = await prisma.user.upsert({
            where: { email: c.email },
            update: {},
            create: {
                email: c.email,
                name: c.name,
                password: passwordHash,
                role: c.role,
                headline: c.headline,
                bio: "Apasionado por la tecnología y la optimización de procesos. Buscando nuevos desafíos.",
                city: "Córdoba, Arg"
            }
        });

        // Postular a 1 o 2 trabajos RANDOM del usuario objetivo
        const randomJobs = createdJobs.sort(() => 0.5 - Math.random()).slice(0, 2);

        for (const job of randomJobs) {
            // Intentar crear application (ignorando si ya existe por unique constraint)
            try {
                // Random status
                const statuses = ["PENDING", "PENDING", "REJECTED", "HIRED", "PENDING"];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

                await prisma.application.create({
                    data: {
                        userId: candidate.id,
                        jobId: job.id,
                        status: randomStatus
                    }
                });
            } catch (e) {
                // Ignore unique constraint violation
            }
        }
    }

    console.log("🚀 ¡Script completado con éxito!");
    console.log(`El usuario ${targetEmail} ahora es una EMPRESA con ofertas y candidatos.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
