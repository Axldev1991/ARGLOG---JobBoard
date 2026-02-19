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
        <div className="bg-card/40 backdrop-blur-[var(--glass-blur)] border-[var(--glass-border)] rounded-3xl hover:shadow-[0_20px_40px_-20px_rgba(var(--primary),0.3)] hover:border-primary/50 transition-all duration-300 group flex flex-col h-full relative overflow-hidden dark:bg-card dark:backdrop-blur-none dark:border-border dark:rounded-2xl dark:hover:border-primary/50 dark:hover:shadow-lg">
            {/* 1. Área Clickable (Info) */}
            <Link href={`/jobs/${job.id}`} className="p-6 flex-grow flex flex-col">
                <div className="w-12 h-12 bg-primary/5 dark:bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-[0_0_15px_-5px_rgba(var(--primary),0.3)] border border-primary/10 group-hover:border-primary">
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
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                        <span className="text-muted-foreground font-normal">Salario:</span>
                        <span className="text-primary">{job.salary ? `$${job.salary}` : 'A convenir'}</span>
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
                        className="block w-full text-center bg-gradient-to-b from-primary via-primary to-blue-800 text-white dark:text-blue-900 font-black py-3 rounded-xl transition-all shadow-[0_5px_0_0_#1e3a8a,0_8px_16px_-6px_rgba(var(--primary),0.4),inset_0_1px_0_0_rgba(255,255,255,0.4),inset_0_-2px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_0_0_#1e3a8a,0_12px_24px_-8px_rgba(var(--primary),0.6)] hover:-translate-y-[1px] active:translate-y-[2px] active:shadow-[0_2px_0_0_#1e3a8a] active:scale-[0.98] ring-1 ring-primary/10 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:h-1/2 dark:from-primary dark:to-primary dark:shadow-none dark:before:hidden dark:active:translate-y-0 dark:hover:translate-y-0 dark:ring-0 dark:font-bold"
                    >
                        <span className="relative z-10">Ver Oferta</span>
                    </Link>
                )}
            </div>
        </div>
    );
}
