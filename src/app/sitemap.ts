import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'
import { absoluteUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Obtener todas las ofertas PUBLICADAS
    const jobs = await prisma.job.findMany({
        where: {
            status: 'PUBLISHED',
        },
        select: {
            id: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc',
        }
    })

    // 2. Generar las entradas del sitemap para cada oferta
    const jobEntries: MetadataRoute.Sitemap = jobs.map((job) => ({
        url: absoluteUrl(`/jobs/${job.id}`),
        lastModified: job.createdAt,
        changeFrequency: 'weekly',
        priority: 0.8,
    }))

    // 3. Retornar el array completo (Home + Jobs)
    return [
        {
            url: absoluteUrl('/'),
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...jobEntries,
    ]
}
