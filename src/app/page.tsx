"use server";

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
import { HomeCTA } from "@/components/shared/home-cta";
import { getFeaturedJobs, getJobs } from "@/actions/jobs/get-jobs";

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const session = await getSession();

  // 1. Parse Search Parameters
  const query = (searchParams.q as string) || "";
  const category = (searchParams.category as string) || "";
  const modality = (searchParams.modality as string) || "";
  const tagsParam = (searchParams.tags as string) || "";
  const selectedTags = tagsParam ? tagsParam.split(",") : [];

  // Pagination Params
  const currentPage = Number(searchParams.page) || 1;
  const PAGE_SIZE = 6;

  // 2. Fetch Data (Server Actions)
  const featuredJobs = await getFeaturedJobs(6);
  const featuredIds = featuredJobs.map((j) => j.id);

  // Detect active filters
  const hasFilters = query || category || modality || selectedTags.length > 0;

  // 3. Fetch Job List
  // Optimization: We pass the featured IDs to exclude them from the main list directly in the DB query
  // This ensures pagination is correct and we don't fetch duplicates.
  const { jobs, totalJobs } = await getJobs({
    query,
    category,
    modality,
    tags: selectedTags,
    page: currentPage,
    pageSize: PAGE_SIZE,
    userId: session?.id,
    excludeIds: !hasFilters ? (featuredIds as number[]) : [], // Only exclude if not searching
  });

  const displayJobs = jobs;

  const totalPages = Math.ceil(totalJobs / PAGE_SIZE);

  return (
    <main className="bg-background min-h-screen pb-20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-[1000px] pointer-events-none opacity-40 dark:opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-blue-400/10 blur-[100px] rounded-full" />
        <div className="absolute top-[50%] left-[10%] w-[30%] h-[30%] bg-emerald-400/5 blur-[80px] rounded-full" />
      </div>

      <Hero user={session} />

      <div className="max-w-7xl mx-auto px-6 -mt-10 flex flex-col gap-12 relative z-10">
        {/* 1. FEATURED CAROUSEL */}
        {featuredJobs.length > 0 && (
          <section className="z-30">
            <FeaturedCarousel jobs={featuredJobs} />
          </section>
        )}

        {/* 2. FILTERS */}
        <div className="bg-card/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl shadow-black/5 border border-border z-20">
          <SearchFilters />
        </div>

        {/* 3. MAIN LIST - FIRST PART */}
        <section scroll-mt="100px" id="job-list-section" className="relative">
          <ScrollToTopOnChange />

          <div className="mb-10 flex items-center justify-between">
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary rounded-full"></div>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                {hasFilters ? "Resultados de búsqueda" : "Todas las Ofertas"}
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse hidden md:block" />
              </h2>
              <p className="text-muted-foreground mt-2 font-medium">
                Explora las mejores oportunidades en el sector logístico.
              </p>
            </div>
            <div className="text-muted-foreground text-sm hidden sm:block font-bold bg-muted px-4 py-2 rounded-full border border-border">
              Mostrando <span className="text-primary">{displayJobs.length}</span> de {totalJobs} resultados
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayJobs.slice(0, 3).map((job) => {
              const hasApplied = job.applications.length > 0;
              return (
                <JobCard key={job.id} job={job as any} hasApplied={hasApplied} />
              );
            })}
          </div>
        </section>
      </div>

      {/* INTERMEDIATE CTA */}
      <HomeCTA />

      {/* 4. MAIN LIST - SECOND PART */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayJobs.slice(3, 6).map((job) => {
              const hasApplied = job.applications.length > 0;
              return (
                <JobCard key={job.id} job={job as any} hasApplied={hasApplied} />
              );
            })}
          </div>

          {/* Empty State */}
          {displayJobs.length === 0 && (
            <div className="text-center py-32 bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-700">
              <div className="text-5xl mb-4 text-slate-600">🔍</div>
              <h3 className="text-xl font-bold text-white">No hay resultados</h3>
              <p className="text-slate-400 mt-2">
                Prueba ajustando los filtros de búsqueda.
              </p>
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-4">
              {currentPage > 1 ? (
                <Link
                  href={`/?page=${currentPage - 1}${getQueryString(searchParams)}`}
                  scroll={false}
                >
                  <Button
                    variant="outline"
                    className="border-border text-foreground hover:bg-primary hover:text-primary-foreground shadow-sm"
                  >
                    <ChevronLeft size={16} className="mr-1" /> Anterior
                  </Button>
                </Link>
              ) : (
                <Button
                  disabled
                  variant="outline"
                  className="border-border text-muted-foreground opacity-50"
                >
                  <ChevronLeft size={16} className="mr-1" /> Anterior
                </Button>
              )}

              <span className="text-muted-foreground font-bold text-sm bg-muted h-10 flex items-center px-6 rounded-xl border border-border">
                Página <span className="text-primary mx-1">{currentPage}</span> de {totalPages}
              </span>

              {currentPage < totalPages ? (
                <Link
                  href={`/?page=${currentPage + 1}${getQueryString(searchParams)}`}
                  scroll={false}
                >
                  <Button
                    variant="outline"
                    className="border-border text-foreground hover:bg-primary hover:text-primary-foreground shadow-sm"
                  >
                    Siguiente <ChevronRight size={16} className="ml-1" />
                  </Button>
                </Link>
              ) : (
                <Button
                  disabled
                  variant="outline"
                  className="border-border text-muted-foreground opacity-50"
                >
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

  Object.keys(rest).forEach((key) => {
    if (rest[key]) searchParams.append(key, rest[key]);
  });

  const str = searchParams.toString();
  return str ? `&${str}` : "";
}
