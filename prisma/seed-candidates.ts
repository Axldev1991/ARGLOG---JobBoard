import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando siembra de candidatos...');

    // 1. Obtener todas las ofertas existentes para postularse
    const jobs = await prisma.job.findMany();
    if (jobs.length === 0) {
        console.error('❌ No hay ofertas de trabajo. Crea algunas ofertas primero.');
        return;
    }
    const candidatePasswordPlain = process.env.SEED_CANDIDATE_PASSWORD || "axlrose91";
    const hashedPassword = await hash(candidatePasswordPlain, 10);

    // Listado de tags oficiales para conectar
    const tags = await prisma.tag.findMany();

    // Datos fake variados del sector logístico
    const candidatesData = [
        { name: "Marcos Rodríguez", email: "marcos.log@example.com", headline: "Operador de Autoelevador Senior", bio: "10 años de experiencia en centros de distribución de gran escala." },
        { name: "Lucía Pedernera", email: "lucia.p@example.com", headline: "Analista de Inventarios", bio: "Especialista en control de stock y auditoría de almacenes." },
        { name: "Roberto Sánchez", email: "roberto.transporte@example.com", headline: "Planificador de Tráfico", bio: "Optimización de rutas nacionales e internacionales." },
        { name: "Estefanía Gomez", email: "estefi.comex@example.com", headline: "Especialista en Aduanas", bio: "Gestión documental para importación y exportación." },
        { name: "Cristian Viale", email: "cristian.v@example.com", headline: "Preparador de Pedidos / Picking", bio: "Experto en manejo de WMS y radiofrecuencia." },
        { name: "Mónica Juárez", email: "moni.calidad@example.com", headline: "Auditor de Calidad Logística", bio: "Aseguramiento de procesos en cadena de frío." },
        { name: "Facundo Ríos", email: "facu.mecanico@example.com", headline: "Mecánico de Flota Pesada", bio: "Mantenimiento preventivo y correctivo de camiones." },
        { name: "Gabriel Sotelo", email: "gabi.sap@example.com", headline: "Operador SAP WMS", bio: "Carga de datos y gestión de almacén vía SAP." },
        { name: "Valeria Conti", email: "valeria.milla@example.com", headline: "Coordinadora de Última Milla", bio: "Gestión de repartos en zonas urbanas de alta densidad." },
        { name: "Daniel Ortega", email: "dani.inversa@example.com", headline: "Responsable de Logística Inversa", bio: "Gestión eficiente de devoluciones y devoluciones." },
    ];

    for (const data of candidatesData) {
        // Seleccionamos 2-3 tags aleatorios para este candidato
        const randomTags = tags.sort(() => 0.5 - Math.random()).slice(0, 3);

        const user = await prisma.user.upsert({
            where: { email: data.email },
            update: {
                tags: {
                    set: randomTags.map(t => ({ id: t.id }))
                }
            },
            create: {
                email: data.email,
                name: data.name,
                password: hashedPassword,
                role: "candidate",
                headline: data.headline,
                bio: data.bio,
                city: "Buenos Aires, AR",
                tags: {
                    connect: randomTags.map(t => ({ id: t.id }))
                }
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
