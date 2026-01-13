import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { Hero } from "@/components/shared/hero";
import { getSession } from "@/lib/session";
import { JobCard } from "@/components/shared/job-card";
import { SearchFilters } from "@/components/shared/search-filter";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}


export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q as string || "";
  const category = params.category as string || "";
  const modality = params.modality as string || "";
  const tagsParam = params.tags as string || ""; // Nuevo parámetro
  const selectedTags = tagsParam ? tagsParam.split(',') : [];

  const jobs = await prisma.job.findMany({
    where: {
      // 1. Buscador de Texto (OR) -> Solo si hay texto escrito
      ...(query ? {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { some: { name: { contains: query, mode: 'insensitive' } } } }
        ]
      } : {}),

      // 2. Filtros Estrictos (AND implícito) -> Solo si se seleccionó algo
      ...(category ? { category: { equals: category } } : {}),
      ...(modality ? { modality: { equals: modality } } : {}),
      // 3. Filtro por Tag Pill (AND explícito)
      ...(selectedTags.length > 0 ? {
        AND: selectedTags.map(t => ({
          tags: { some: { name: { contains: t, mode: 'insensitive' } } }
        }))
      } : {})
    },
    include: { tags: true },
    orderBy: { createdAt: 'desc' }
  });
  const user = await getSession();

  return (
    <main className="">
      {/* 1. SECCIÓN HERO: Bienvenida e imagen grande */}
      <Hero user={user} />

      <div className="p-10 max-w-7xl mx-auto">
        <SearchFilters />
        <h1 className="text-3xl font-bold mb-8">Ofertas de Trabajo</h1>

        {/* 2. GRID DE OFERTAS: Lista de tarjetas responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}

        </div>
      </div>
    </main>
  );
}

