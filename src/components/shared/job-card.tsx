import Link from "next/link";
import { CheckCircle, Briefcase } from "lucide-react";

interface JobWithTags {
    id: number;
    title: string;
    description: string;
    salary: string | null;
    tags?: { id: number, name: string }[];
}


export function JobCard({ job, hasApplied }: { job: JobWithTags, hasApplied: boolean }) {
    return (
        <div className="bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 rounded-2xl group flex flex-col h-full relative overflow-hidden">
            {/* 1. Área Clickable (Info) */}
            <Link href={`/jobs/${job.id}`} className="p-6 flex-grow flex flex-col">
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-muted-foreground mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm border border-border group-hover:border-primary">
                    <Briefcase size={22} />
                </div>

                <h2 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors">
                    {job.title}
                </h2>

                <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                    {job.description}
                </p>

                {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {job.tags.slice(0, 3).map(tag => (
                            <span key={tag.id} className="bg-secondary text-secondary-foreground text-[10px] font-semibold uppercase px-2.5 py-1 rounded-md border border-border/50">
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </Link>

            {/* 2. Sección de Acción (Botón Ver oferta) */}
            <div className="px-6 pb-6 pt-2 space-y-4">
                <div className="flex justify-between items-center text-sm border-t border-border pt-4 mb-3">
                    <span className="font-bold text-foreground flex items-center gap-1">
                        <span className="text-muted-foreground font-normal">Salario:</span>
                        {job.salary ? `$${job.salary}` : 'A convenir'}
                    </span>
                </div>

                {hasApplied ? (
                    <Link
                        href={`/jobs/${job.id}`}
                        className="flex items-center justify-center gap-2 w-full text-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold py-3 rounded-xl transition-all cursor-pointer hover:bg-emerald-500/20"
                    >
                        <CheckCircle size={18} />
                        Postulado
                    </Link>
                ) : (
                    <Link
                        href={`/jobs/${job.id}`}
                        className="block w-full text-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl transition-all shadow-md"
                    >
                        Ver Oferta
                    </Link>
                )}
            </div>
        </div>
    );
}
