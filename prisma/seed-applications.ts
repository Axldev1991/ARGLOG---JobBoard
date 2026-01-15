import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Generating fake applications to simulate activity...')

    // 1. Fetch Candidates and Jobs
    const candidates = await prisma.user.findMany({
        where: { role: 'candidate' }
    })

    // Only apply to PUBLISHED jobs
    const jobs = await prisma.job.findMany({
        where: { status: 'PUBLISHED' }
    })

    if (candidates.length === 0 || jobs.length === 0) {
        console.error('❌ No candidates or jobs found. Please run the main seed first.')
        return
    }

    console.log(`found ${candidates.length} candidates and ${jobs.length} jobs.`)

    let applicationsCreated = 0;

    // 2. Generate random applications
    // Each candidate will apply to 1-5 random jobs
    for (const candidate of candidates) {
        const numberOfApplications = Math.floor(Math.random() * 5) + 1; // 1 to 5 apps per candidate

        // Shuffle jobs to pick random ones
        const shuffledJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, numberOfApplications);

        for (const job of shuffledJobs) {
            // Check if application already exists to avoid bad constraints
            const existing = await prisma.application.findUnique({
                where: {
                    userId_jobId: {
                        userId: candidate.id,
                        jobId: job.id
                    }
                }
            });

            if (existing) continue;

            // Random status
            const statuses = ['PENDING', 'PENDING', 'REJECTED', 'HIRED'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

            await prisma.application.create({
                data: {
                    userId: candidate.id,
                    jobId: job.id,
                    status: randomStatus
                }
            });
            applicationsCreated++;
        }
    }

    console.log(`✅ Successfully created ${applicationsCreated} new applications!`)
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
