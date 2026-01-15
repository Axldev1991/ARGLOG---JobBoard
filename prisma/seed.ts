import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

// Arrays of dummy data for generation
const JOB_TITLES = [
    "Frontend Developer", "Backend Engineer", "Full Stack Dev", "DevOps Specialist",
    "UI/UX Designer", "Product Manager", "Data Scientist", "QA Automation",
    "Technical Lead", "CTO", "Mobile Developer (iOS)", "Mobile Developer (Android)",
    "Cloud Architect", "System Administrator", "Security Analyst"
];

const CITIES = ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Mar del Plata", "San Miguel de Tucumán", "Salta"];
const MODALITIES = ["Remoto", "Híbrido", "Presencial"];
const CATEGORIES = ["IT", "Diseño", "Marketing", "RRHH", "Finanzas"];
const TAGS_POOL = ["React", "Node.js", "Java", "Python", "AWS", "Docker", "Figma", "Agile", "Inglés", "SQL"];

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
                type: 'Tech' // Simplification for mass seed
            }
        })
    }
    console.log('🏷️  Created Tags')

    // 3. Create Admin
    const adminPassword = await hash('admin123', 10)
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
    const password = await hash('123456', 10);
    const companyIds: number[] = [];

    // Fixed Demo Company
    const mainCompany = await prisma.user.create({
        data: {
            email: 'tech@corp.com',
            password: password,
            name: 'Tech Corp (Demo)',
            role: 'company',
            companyProfile: {
                create: {
                    legalName: 'Technology Corporation S.A.',
                    cuit: '30-11223344-5',
                    industry: 'Software',
                    description: 'Líderes en desarrollo de software de alta calidad.',
                    website: 'https://techcorp.com'
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
                name: `Empresa Test ${i}`,
                role: 'company',
                companyProfile: {
                    create: {
                        legalName: `Sociedad Anonima ${i}`,
                        cuit: `30-${10000000 + i}-1`,
                        industry: getRandomItem(CATEGORIES),
                        description: `Empresa generada automáticamente ${i} especializada en servicios digitales.`,
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
            name: 'Alex Developer (Demo)',
            role: 'candidate',
            headline: 'Full Stack Ninja',
            city: 'Buenos Aires'
        }
    });

    for (let i = 1; i <= 49; i++) {
        await prisma.user.create({
            data: {
                email: `candidate${i}@test.com`,
                password: password,
                name: `Candidato Generado ${i}`,
                role: 'candidate',
                headline: getRandomItem(JOB_TITLES),
                city: getRandomItem(CITIES),
                bio: `Bio autogenerada para el candidato ${i}. Lorem ipsum dolor sit amet.`
            }
        });
    }
    console.log('👨‍💻 Created 50 Candidates')

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
                title: `${title} ${mod === 'Remoto' ? '(Remote)' : ''}`,
                description: `Buscamos un ${title} apasionado para unirse a nuestro equipo. \n\nResponsabilidades:\n- Escribir código limpio.\n- Colaborar con el equipo.\n\nRequisitos:\n- Experiencia en ${randomTags.join(', ')}.`,
                salary: `${Math.floor(Math.random() * 4000) + 1000} USD`,
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
