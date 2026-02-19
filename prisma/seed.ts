import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

// Arrays of dummy data for generation
const JOB_TITLES = [
    "Analista de Inventarios", "Operador de Autoelevador", "Planificador de Tráfico",
    "Responsable de Logística Inversa", "Preparador de Pedidos", "Especialista en Aduanas",
    "Coordinador de Última Milla", "Mecánico de Flota", "Auditor de Calidad Logística",
    "Operador SAP WMS", "Supervisor de Almacén", "Gerente de Operaciones"
];

const CITIES = ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Mar del Plata", "San Miguel de Tucumán", "Salta"];
const MODALITIES = ["Presencial", "Híbrido"];
const CATEGORIES = ["Almacenamiento", "Transporte", "Distribución", "Commercio Exterior", "Mantenimiento"];
const TAGS_POOL = [
    "Analista de Inventarios / Control de Stock",
    "Operador de Clark / Autoelevador (con carnet habilitante)",
    "Planificador de Rutas / Tráfico",
    "Gestión de Devoluciones / Logística Inversa",
    "Preparador de Pedidos / Picking & Packing",
    "Especialista en Comercio Exterior / Aduanas",
    "Coordinador de Última Milla",
    "Mantenimiento de Flota",
    "Auditor de Calidad en Procesos Logísticos",
    "Operador de Sistemas de Gestión de Almacenes (WMS / SAP)"
];

function getRandomItem(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
    console.log('🌱 Starting seed generation (Volume: 10 Companies, 50 Candidates, 50 Jobs)...')

    // 1. Clean Database
    await prisma.application.deleteMany()
    await prisma.job.deleteMany()
    await prisma.tag.deleteMany()
    await prisma.companyProfile.deleteMany()
    await prisma.user.deleteMany()

    console.log('🧹 Database cleaned')

    // 2. Create Global Tags
    for (const name of TAGS_POOL) {
        await prisma.tag.create({
            data: {
                name,
                type: 'hard'
            }
        })
    }
    console.log('🏷️  Created Tags')

    // 3. Create Admin
    const adminPasswordPlain = process.env.ADMIN_SEED_PASSWORD || "admin123";
    const adminPassword = await hash(adminPasswordPlain, 10)
    await prisma.user.create({
        data: {
            email: 'admin@jobboard.com',
            password: adminPassword,
            name: 'Super Admin',
            role: 'admin',
        }
    })
    console.log('👮 Admin created')

    // 4. Create 10 Companies ( 1 Fixed + 9 Generic)
    const genericPasswordPlain = process.env.SEED_CANDIDATE_PASSWORD || "axlrose91";
    const password = await hash(genericPasswordPlain, 10);
    const companyIds: number[] = [];

    // Fixed Demo Company
    const mainCompany = await prisma.user.create({
        data: {
            email: 'tech@corp.com',
            password: password,
            name: 'Tech Logística (Demo)',
            role: 'company',
            companyProfile: {
                create: {
                    legalName: 'Logistics Technology S.A.',
                    cuit: '30-11223344-5',
                    industry: 'Transporte',
                    description: 'Líderes en soluciones logísticas integrales.',
                    website: 'https://techlogistica.com'
                }
            }
        }
    });
    companyIds.push(mainCompany.id);

    // 9 Extra Companies
    for (let i = 1; i <= 9; i++) {
        const comp = await prisma.user.create({
            data: {
                email: `company${i}@test.com`,
                password: password,
                name: `Empresa Logística ${i}`,
                role: 'company',
                companyProfile: {
                    create: {
                        legalName: `Sociedad Anonima Logística ${i}`,
                        cuit: `30-${10000000 + i}-1`,
                        industry: getRandomItem(CATEGORIES),
                        description: `Empresa generada automáticamente ${i} especializada en distribución.`,
                        website: `https://test-company-${i}.com`
                    }
                }
            }
        });
        companyIds.push(comp.id);
    }
    console.log(`🏢 Created ${companyIds.length} Companies`)

    // 5. Create 50 Candidates (1 Fixed + 49 Generic)
    await prisma.user.create({
        data: {
            email: 'dev@talent.com',
            password: password,
            name: 'Alex Candidato (Demo)',
            role: 'candidate',
            headline: 'Especialista en Última Milla',
            city: 'Buenos Aires',
            tags: {
                connect: TAGS_POOL.slice(0, 3).map(name => ({ name }))
            }
        }
    });

    for (let i = 1; i <= 49; i++) {
        const randomTags = TAGS_POOL.sort(() => 0.5 - Math.random()).slice(0, 3);
        await prisma.user.create({
            data: {
                email: `candidate${i}@test.com`,
                password: password,
                name: `Candidato Generado ${i}`,
                role: 'candidate',
                headline: getRandomItem(JOB_TITLES),
                city: getRandomItem(CITIES),
                bio: `Bio autogenerada para el candidato ${i} con experiencia en operaciones logísticas.`,
                tags: {
                    connect: randomTags.map(name => ({ name }))
                }
            }
        });
    }
    console.log('👨‍💻 Created 50 Candidates with Tags')

    // 6. Create 50 Jobs distributed among Companies
    for (let i = 1; i <= 50; i++) {
        const randomCompanyId = getRandomItem(companyIds);
        const title = getRandomItem(JOB_TITLES);
        const mod = getRandomItem(MODALITIES);
        const cat = getRandomItem(CATEGORIES);

        // Some logic to create "Rejected" jobs occasionally (10% chance)
        const status = Math.random() > 0.9 ? "REJECTED" : "PUBLISHED";

        // Random tags connection
        const randomTags = TAGS_POOL.sort(() => 0.5 - Math.random()).slice(0, 3);
        const tagConnect = randomTags.map(t => ({ name: t }));

        await prisma.job.create({
            data: {
                title: `${title}`,
                description: `Buscamos un ${title} apasionado para unirse a nuestro equipo de operaciones. \n\nResponsabilidades:\n- Gestión de almacén.\n- Colaborar con el equipo de tráfico.\n\nRequisitos:\n- Experiencia demostrable en ${randomTags.join(', ')}.`,
                salary: `${Math.floor(Math.random() * 800000) + 400000} ARS`,
                category: cat,
                modality: mod,
                location: getRandomItem(CITIES),
                status: status,
                authorId: randomCompanyId,
                tags: {
                    connect: tagConnect
                }
            }
        });
    }
    console.log('💼 Created 50 Jobs')
    console.log('✅ Mass Seed finished successfully')
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
