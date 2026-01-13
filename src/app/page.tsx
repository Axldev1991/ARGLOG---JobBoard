import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { Hero } from "@/components/shared/hero";
import { SearchFilters } from "@/components/shared/search-filter";
import { ApplyButton } from "@/components/shared/apply-button";
import { JobCard } from "@/components/shared/job-card";

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const session = await getSession();

  const query = searchParams.q as string || "";
  const category = searchParams.category as string || "";
  const modality = searchParams.modality as string || "";
  const tagsParam = searchParams.tags as string || "";
  const selectedTags = tagsParam ? tagsParam.split(',') : [];

  // --------------------------------------------------------------------------
  // 🧠 LÓGICA DE FILTRADO (Prisma + URL Params)
  // --------------------------------------------------------------------------
  const whereClause: any = {
    AND: [
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
      } : {}
    ]
  };

  const jobs = await prisma.job.findMany({
    where: whereClause,
    include: {
      tags: true,
      applications: {
        where: {
          userId: session?.id || -1
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="bg-[#0f172a] min-h-screen pb-20">
      {/* 1. SECCIÓN HERO: Bienvenida */}
      <Hero user={session} />

      <div className="max-w-7xl mx-auto px-6 -mt-10 flex flex-col gap-12">

        {/* 2. FILTROS: Mejor integrados */}
        <div className="bg-white p-4 rounded-2xl shadow-2xl shadow-black/50 border border-slate-800 z-20">
          <SearchFilters />
        </div>

        <section>
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Ofertas Disponibles
            </h2>
            <p className="text-slate-400 mt-2">
              Explora las mejores oportunidades en el sector logístico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => {
              const hasApplied = job.applications.length > 0;

              return (
                <JobCard
                  key={job.id}
                  job={job}
                  hasApplied={hasApplied} // <--- Pasamos esta prop nueva
                />
              );
            })}
          </div>

          {jobs.length === 0 && (
            <div className="text-center py-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-slate-800">No hay resultados</h3>
              <p className="text-slate-500 mt-2">Prueba ajustando los filtros de búsqueda.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
