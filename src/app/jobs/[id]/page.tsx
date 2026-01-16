import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { ApplyButton } from "@/components/shared/apply-button";
import { MapPin, Briefcase, Calendar, DollarSign, Clock, ArrowLeft, Tag as TagIcon, Building2 } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const jobId = parseInt(id);
  const session = await getSession();

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      author: true,
      tags: true, // ✅ IMPORTANTÍSIMO: Traer los tags
      applications: {
        where: {
          userId: session?.id || -1
        }
      }
    }
  });

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Oferta no encontrada 😢</h2>
          <Link href="/" className="text-blue-400 hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const hasApplied = job.applications.length > 0;

  // Lógica de expiración visual
  const isExpired = job.expiresAt && new Date(job.expiresAt) < new Date();
  const isAvailable = job.status === 'PUBLISHED' && !isExpired;

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* 1. Header Navigation */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft size={18} />
          Volver a Ofertas
        </Link>

        {/* Hero Card */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              {!isAvailable && (
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold">
                  <Clock size={14} />
                  Esta oferta ha finalizado o expirado
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 leading-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-muted-foreground text-sm font-medium">
                <div className="flex items-center gap-1.5">
                  <Building2 size={16} className="text-blue-500" />
                  <span>{job.author.name}</span>
                </div>
                {job.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-emerald-500" />
                    <span>{job.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded text-foreground">
                  <Briefcase size={14} />
                  {job.modality}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-amber-500" />
                  <span>Publicado el {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* COLUMNA IZQUIERDA: Descripción */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card rounded-2xl p-8 text-card-foreground shadow-lg border border-border">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border pb-4">
              <FileTextIcon /> Descripción del Puesto
            </h3>
            <div className="prose max-w-none text-muted-foreground leading-relaxed whitespace-pre-line dark:prose-invert">
              {job.description}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Sidebar Detalles */}
        <div className="space-y-6">

          {/* Tarjeta de Aplicación */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg sticky top-8">
            <div className="mb-6">
              <p className="text-muted-foreground text-sm mb-1 uppercase font-bold tracking-wider">Salario Ofrecido</p>
              <div className="text-2xl font-bold text-foreground flex items-center gap-2">
                <DollarSign className="text-green-400" />
                {job.salary ? job.salary : 'A convenir'}
              </div>
            </div>

            <div className="mb-8">
              {isAvailable ? (
                <>
                  <ApplyButton jobId={job.id} hasApplied={hasApplied} />
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Al postularte, aceptas compartir tu perfil profesional con la empresa.
                  </p>
                </>
              ) : (
                <Button disabled className="w-full bg-muted text-muted-foreground cursor-not-allowed">
                  Postulaciones Cerradas
                </Button>
              )}
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <div>
                <p className="text-muted-foreground text-xs mb-1 uppercase font-bold">Categoría</p>
                <p className="text-foreground font-medium">{job.category}</p>
              </div>

              {/* TAGS */}
              {job.tags && job.tags.length > 0 && (
                <div>
                  <p className="text-muted-foreground text-xs mb-2 uppercase font-bold flex items-center gap-1">
                    <TagIcon size={12} /> Habilidades Requeridas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map(tag => (
                      <span key={tag.id} className="bg-muted border border-border text-foreground text-xs px-2.5 py-1 rounded-full">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tarjeta Extra: Compartir (Placeholder) */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            <h4 className="font-bold text-foreground mb-4">¿Conoces a alguien?</h4>
            <Button variant="outline" className="w-full border-border text-muted-foreground hover:bg-muted hover:text-foreground">
              Compartir Oferta
            </Button>
          </div>

        </div>

      </div>
    </main>
  );
}

function FileTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
  )
}