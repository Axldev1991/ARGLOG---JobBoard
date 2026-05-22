import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Starting restore from snapshot...');

    const snapshotPath = path.join(process.cwd(), '../documentation/cli/backups/snapshot_2026-05-17T17-33-57-984Z.json');
    if (!fs.existsSync(snapshotPath)) {
        console.error('❌ Snapshot file not found at:', snapshotPath);
        process.exit(1);
    }

    const rawData = fs.readFileSync(snapshotPath, 'utf8');
    const snapshot = JSON.parse(rawData);
    const data = snapshot.data;

    console.log(`📦 Loaded snapshot from ${snapshot.timestamp}`);

    // 1. Clean Database (just in case)
    await prisma.systemLog.deleteMany();
    await prisma.application.deleteMany();
    await prisma.job.deleteMany();
    await prisma.companyProfile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.tag.deleteMany();

    console.log('🧹 Database cleaned');

    // 2. Restore Tags
    if (data.tags && data.tags.length > 0) {
        await prisma.tag.createMany({
            data: data.tags.map((t: any) => ({
                id: t.id,
                name: t.name,
                type: t.type
            }))
        });
        console.log(`🏷️ Restored ${data.tags.length} Tags`);
    }

    // 3. Restore Users
    if (data.users && data.users.length > 0) {
        // Create sequentially to maintain ID if needed, or use createMany
        await prisma.user.createMany({
            data: data.users.map((u: any) => ({
                id: u.id,
                email: u.email,
                password: u.password,
                name: u.name,
                role: u.role,
                status: u.status,
                createdAt: new Date(u.createdAt),
                resumeUrl: u.resumeUrl,
                bio: u.bio,
                city: u.city,
                headline: u.headline,
                linkedin: u.linkedin,
                phone: u.phone,
                resumePublicId: u.resumePublicId
            }))
        });
        console.log(`👨‍💻 Restored ${data.users.length} Users`);
    }

    // 4. Restore Companies
    if (data.companies && data.companies.length > 0) {
        await prisma.companyProfile.createMany({
            data: data.companies.map((c: any) => ({
                id: c.id,
                logo: c.logo,
                website: c.website,
                description: c.description,
                userId: c.userId,
                legalName: c.legalName,
                cuit: c.cuit,
                industry: c.industry
            }))
        });
        console.log(`🏢 Restored ${data.companies.length} Companies`);
    }

    // 5. Restore Logs
    if (data.logs && data.logs.length > 0) {
        await prisma.systemLog.createMany({
            data: data.logs.map((l: any) => ({
                id: l.id,
                level: l.level,
                message: l.message,
                metadata: l.metadata,
                source: l.source,
                createdAt: new Date(l.createdAt)
            }))
        });
        console.log(`📝 Restored ${data.logs.length} Logs`);
    }

    // We must reset the Postgres sequences so that new records don't conflict with imported IDs
    try {
        await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max(id)+1, 1), false) FROM "User";`);
        await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"CompanyProfile"', 'id'), coalesce(max(id)+1, 1), false) FROM "CompanyProfile";`);
        await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Tag"', 'id'), coalesce(max(id)+1, 1), false) FROM "Tag";`);
        console.log('🔢 PostgreSQL auto-increment sequences updated');
    } catch (e) {
        console.log('⚠️ Could not update Postgres sequences. (Normal if empty)');
    }

    console.log('✅ Restore finished successfully!');
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
