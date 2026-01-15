import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { Hero } from "@/components/shared/hero";
import { SearchFilters } from "@/components/shared/search-filter";
import { JobCard } from "@/components/shared/job-card";
import { FeaturedCarousel } from "@/components/shared/featured-carousel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollToTopOnChange } from "@/components/shared/scroll-to-top-on-change";

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const session = await getSession();

  // 1. Obtener Params de Filtro
  const query = searchParams.q as string || "";
  const category = searchParams.category as string || "";
  const modality = searchParams.modality as string || "";
  const tagsParam = searchParams.tags as string || "";
  const selectedTags = tagsParam ? tagsParam.split(',') : [];

  // Paginación Params
  const currentPage = Number(searchParams.page) || 1;
  const PAGE_SIZE = 9;

  // Detectar si hay filtros activos (Search mode)
  const hasFilters = query || category || modality || selectedTags.length > 0;

  // 2. CARRUSEL: Siempre obtener "Featured"
  const featuredJobs = await prisma.job.findMany({
    take: 6,
    where: {
      status: "PUBLISHED",
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    },
    orderBy: { createdAt: "desc" },
    include: { tags: true, author: true }
  });
  const featuredIds = featuredJobs.map(j => j.id);

  // 3. LISTA PRINCIPAL
  const whereClause: any = {
    AND: [
      {
        status: "PUBLISHED",
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      query ? {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ]
      } : {},
      category ? { category } : {},
      modality ? { modality } : {},
      selectedTags.length > 0 ? {
        AND: selectedTags.map(t => ({
          tags: { some: { name: { contains: t.trim(), mode: "insensitive" } } }
        }))
      } : {},

      // LOGICA DE EXCLUSIÓN CORREGIDA:
      // Solo excluimos si NO hay filtros activos.
      // Si el usuario busca "Excel", mostramos todos los resultados, aunque estén arriba.
      (!hasFilters && featuredIds.length > 0) ? { id: { notIn: featuredIds } } : {}
    ]
  };

  const [jobs, totalJobs] = await Promise.all([
    prisma.job.findMany({
      where: whereClause,
      include: {
        tags: true,
        author: true,
        applications: {
          where: { userId: session?.id || -1 }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.job.count({ where: whereClause })
  ]);

  const totalPages = Math.ceil(totalJobs / PAGE_SIZE);

  return (
    <main className="bg-[#0f172a] min-h-screen pb-20">
      <Hero user={session} />

      <div className="max-w-7xl mx-auto px-6 -mt-10 flex flex-col gap-12">

        {/* 1. CARRUSEL DESTACADOS */}
        {featuredJobs.length > 0 && (
          <section className="z-30">
            <FeaturedCarousel jobs={featuredJobs} />
          </section>
        )}

        {/* 2. FILTROS */}
        <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl shadow-black/50 border border-slate-700/50 z-20">
          <SearchFilters />
        </div>

        {/* 3. LISTADO PRINCIPAL */}
        <section scroll-mt="100px" id="job-list-section" className="relative">
          <ScrollToTopOnChange />

          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                {hasFilters ? "Resultados de búsqueda" : "Todas las Ofertas"}
              </h2>
              <p className="text-slate-400 mt-2">
                Explora las mejores oportunidades en el sector logístico.
              </p>
            </div>
            <div className="text-slate-500 text-sm hidden sm:block">
              Mostrando {jobs.length} de {totalJobs} resultados
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => {
              const hasApplied = job.applications.length > 0;
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  hasApplied={hasApplied}
                />
              );
            })}
          </div>

          {/* Empty State */}
          {jobs.length === 0 && (
            <div className="text-center py-32 bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-700">
              <div className="text-5xl mb-4 text-slate-600">🔍</div>
              <h3 className="text-xl font-bold text-white">No hay resultados</h3>
              <p className="text-slate-400 mt-2">Prueba ajustando los filtros de búsqueda.</p>
            </div>
          )}

          {/* CONTROLES DE PAGINACIÓN */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-4">

              {currentPage > 1 ? (
                <Link
                  href={`/?page=${currentPage - 1}${getQueryString(searchParams)}`}
                  scroll={false}
                >
                  <Button variant="outline" className="border-slate-700 text-white bg-slate-800 hover:bg-slate-700 hover:text-white">
                    <ChevronLeft size={16} className="mr-1" /> Anterior
                  </Button>
                </Link>
              ) : (
                <Button disabled variant="outline" className="border-slate-800 text-slate-600 bg-slate-900 opacity-50">
                  <ChevronLeft size={16} className="mr-1" /> Anterior
                </Button>
              )}

              <span className="text-slate-400 font-mono text-sm px-4">
                Página {currentPage} de {totalPages}
              </span>

              {currentPage < totalPages ? (
                <Link
                  href={`/?page=${currentPage + 1}${getQueryString(searchParams)}`}
                  scroll={false}
                >
                  <Button variant="outline" className="border-slate-700 text-white bg-slate-800 hover:bg-slate-700 hover:text-white">
                    Siguiente <ChevronRight size={16} className="ml-1" />
                  </Button>
                </Link>
              ) : (
                <Button disabled variant="outline" className="border-slate-800 text-slate-600 bg-slate-900 opacity-50">
                  Siguiente <ChevronRight size={16} className="ml-1" />
                </Button>
              )}
            </div>
          )}

        </section>
      </div>
    </main>
  );
}

function getQueryString(params: any): string {
  const { page, ...rest } = params;
  const searchParams = new URLSearchParams();

  Object.keys(rest).forEach(key => {
    if (rest[key]) searchParams.append(key, rest[key]);
  });

  const str = searchParams.toString();
  return str ? `&${str}` : '';
}
