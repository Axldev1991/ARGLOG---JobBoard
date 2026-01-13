/**
 * --------------------------------------------------------------------------
 * 🌱 SCRIPT DE POBLACIÓN (SEEDING) DE EMPLEOS
 * --------------------------------------------------------------------------
 * Uso: npx tsx src/scripts/seed-jobs.ts
 * 
 * Este script genera 30 empleos ficticios asignados a un usuario existente.
 * Útil para probar paginación, filtros y búsquedas con datos masivos.
 * --------------------------------------------------------------------------
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JOB_TITLES = [
    "Analista de Logística Senior",
    "Operario de Depósito (Turno Noche)",
    "Gerente de Cadena de Suministro",
    "Conductor de Autoelevador (Clark)",
    "Coordinador de Flota",
    "Jefe de Almacén de Repuestos",
    "Planner de Abastecimiento",
    "Especialista en Import/Export",
    "Analista de Compras Técnicas",
    "Supervisor de Despacho",
    "Administrativo de Logística",
    "Responsable de Stock e Inventarios",
    "Ingeniero de Procesos Logísticos",
    "Despachante de Aduana Junior",
    "Customer Service Logístico"
];

const LOCATIONS = ["Zona Norte, GBA", "CABA, Buenos Aires", "Rosario, Santa Fe", "Pilar, GBA", "Córdoba Capital", "Remoto", "Ezeiza, GBA", "Mendoza", "Mar del Plata"];
const MODALITIES = ["Presencial", "Híbrido", "Remoto"];
const CATEGORIES = ["Operaciones", "Administración", "Transporte", "Compras", "Comercio Exterior"];

async function main() {
    console.log("🚜 Iniciando siembra masiva de trabajos...");

    // 1. Necesitamos un usuario autor (Agarramos el primero que encontremos o el tuyo)
    const author = await prisma.user.findFirst();

    if (!author) {
        console.error("❌ No existe ningún usuario en la DB. Crea uno primero (registrate en la web).");
        return;
    }

    console.log(`👤 Autor asignado: ${author.email} (ID: ${author.id})`);

    // 2. Traemos los tags para asignar aleatoriamente
    const allTags = await prisma.tag.findMany();
    if (allTags.length === 0) {
        console.error("⚠️ No hay tags en la DB. Corre primero 'npm run seed-tags'");
        return;
    }

    // 3. Generamos 30 trabajos
    for (let i = 0; i < 30; i++) {
        // Datos aleatorios
        const title = JOB_TITLES[Math.floor(Math.random() * JOB_TITLES.length)];
        const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        const modality = MODALITIES[Math.floor(Math.random() * MODALITIES.length)];
        const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        const salary = Math.floor(Math.random() * (2500 - 800) + 800) * 1000; // Ej: 1.200.000

        // Asignar 2 o 3 tags random
        const shuffledTags = allTags.sort(() => 0.5 - Math.random());
        const selectedTags = shuffledTags.slice(0, Math.floor(Math.random() * 2) + 2); // 2 o 3 tags

        await prisma.job.create({
            data: {
                title: `${title} - ${i + 1}`, // Le pongo numero para diferenciar
                description: `Estamos buscando un profesional apasionado para sumarse al equipo de ${title}. Se valorará experiencia en rubro logístico.`,
                salary: salary.toLocaleString('es-AR'),
                location: location,
                modality: modality,
                category: category,
                authorId: author.id,
                tags: {
                    connect: selectedTags.map(t => ({ id: t.id }))
                }
            }
        });

        // Pequeño log de progreso
        if (i % 5 === 0) process.stdout.write(".");
    }

    console.log("\n✅ ¡Listo! 30 ofertas de trabajo creadas exitosamente.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
