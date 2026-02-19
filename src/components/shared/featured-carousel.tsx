"use client";

import useEmblaCarousel from 'embla-carousel-react';
import { Briefcase, MapPin, Building2, ChevronRight, ChevronLeft, Sparkles, Zap } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useCallback } from 'react';

export function FeaturedCarousel({ jobs }: { jobs: any[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    if (jobs.length === 0) return null;

    return (
        <div className="w-full relative group">
            <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="text-amber-500" size={20} /> Últimas Novedades
                </h2>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={scrollPrev}
                        className="h-8 w-8 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <ChevronLeft size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={scrollNext}
                        className="h-8 w-8 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <ChevronRight size={16} />
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
                <div className="flex gap-6 py-2 px-2">
                    {jobs.map((job) => (
                        <div key={job.id} className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_32%] min-w-0">
                            <Link href={`/jobs/${job.id}`} className="block h-full">
                                <div className="bg-card/40 backdrop-blur-[var(--glass-blur)] border-[var(--glass-border)] rounded-3xl p-6 h-full hover:shadow-[0_15px_30px_-10px_rgba(var(--primary),0.2)] hover:border-primary/50 transition-all hover:-translate-y-1 relative group/card overflow-hidden dark:bg-card dark:backdrop-blur-none dark:border-border dark:rounded-2xl dark:hover:border-primary/50 dark:hover:shadow-lg">
                                    {/* Gradiente sutil */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                                    <div className="relative z-10 flex flex-col h-full">

                                        <div className="flex justify-between items-start mb-4">
                                            {/* Icono de Empresa Consistente (Sin emoji) */}
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                                                <Building2 size={20} />
                                            </div>
                                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
                                                NUEVO
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1 group-hover/card:text-primary transition-colors">
                                            {job.title}
                                        </h3>
                                        <div className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                                            <Building2 size={14} />
                                            {job.author?.name || "Empresa Confidencial"}
                                        </div>

                                        <div className="mt-auto space-y-3">
                                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                <span className="bg-primary/5 px-2 py-1 rounded-md flex items-center gap-1 border border-primary/10 text-primary font-medium">
                                                    <Briefcase size={12} /> {job.modality}
                                                </span>
                                                <span className="bg-emerald-500/5 px-2 py-1 rounded-md flex items-center gap-1 border border-emerald-500/10 text-emerald-600 font-medium">
                                                    <MapPin size={12} /> {job.location || "Remoto"}
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
