"use client";

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import Link from 'next/link';

export function HeroSlider() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
    }, [emblaApi]);

    // Auto-play
    useEffect(() => {
        if (!emblaApi) return;
        const interval = setInterval(() => {
            emblaApi.scrollNext();
        }, 5000);
        
        const root = emblaApi.rootNode();
        const pause = () => clearInterval(interval);
        root.addEventListener('mouseenter', pause);
        root.addEventListener('touchstart', pause);
        
        return () => {
            clearInterval(interval);
            root.removeEventListener('mouseenter', pause);
            root.removeEventListener('touchstart', pause);
        };
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        onSelect();
        return () => { emblaApi.off('select', onSelect); };
    }, [emblaApi]);

    return (
        <div className="relative w-full overflow-hidden bg-background">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y">
                    
                    {/* SLIDE 1: Main Hero */}
                    <div className="relative flex-[0_0_100%] min-h-[550px] md:min-h-[600px] flex items-center justify-center lg:justify-start">
                        {/* Background Image & Overlays */}
                        <div className="absolute inset-0 bg-[url('/images/slider/arlog-01.jpg')] bg-cover bg-center" />
                        <div className="absolute inset-0 bg-white/10 dark:bg-black/60" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/10 to-transparent dark:from-background dark:via-background/50" />
                        
                        <div className="relative z-10 px-6 lg:pl-20 max-w-6xl w-full text-center lg:text-left pt-16 lg:pt-0 pb-28 md:pb-0">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/20 text-primary text-xs font-bold tracking-wider uppercase mb-8 shimmer-effect shadow-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Plataforma Nº1 en Logística
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mt-2 leading-[1.05] tracking-tight text-foreground">
                                El Hub del Talento <br className="hidden md:block" />
                                <span className="gradient-text-animated">
                                    Logístico & Operativo.
                                </span>
                            </h1>

                            <p className="text-black mt-7 text-base sm:text-lg md:text-xl max-w-[100%] xl:max-w-[120%] leading-relaxed font-semibold mx-auto lg:mx-0 whitespace-normal lg:whitespace-nowrap">
                                Conectamos a las empresas líderes con los profesionales que mueven el mundo. 
                                <span className="font-extrabold ml-1 block sm:inline">Simple, rápido y efectivo.</span>
                            </p>
                        </div>
                    </div>

                    {/* SLIDE 2: Cursos */}
                    <div className="relative flex-[0_0_100%] min-h-[550px] md:min-h-[600px] flex items-center justify-center lg:justify-start">
                        {/* Background Image & Overlays */}
                        <div className="absolute inset-0 bg-[url('/images/slider/arlog-02-cursos.jpg')] bg-cover bg-[center_30%]" />
                        <div className="absolute inset-0 bg-slate-900/60" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-slate-900/70 to-transparent" />
                        
                        <div className="relative z-10 px-6 lg:pl-20 max-w-6xl w-full text-center lg:text-left pt-16 lg:pt-0 pb-28 md:pb-0">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold tracking-wider uppercase mb-8 backdrop-blur-md">
                                <GraduationCap size={16} />
                                Formación Profesional
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mt-2 leading-[1.05] tracking-tight text-white drop-shadow-lg">
                                Cursos de <br className="hidden md:block" />
                                <span className="text-blue-400">Capacitación</span>
                            </h1>

                            <p className="text-white/90 mt-7 text-lg sm:text-xl md:text-2xl max-w-2xl leading-relaxed font-semibold drop-shadow mx-auto lg:mx-0">
                                En Sede <br/>
                                <span className="font-medium text-white/70 text-base md:text-lg block mt-2">
                                    Cursos Cortos - Talleres - Seminarios - Programas Intensivos
                                </span>
                            </p>

                            <div className="mt-10">
                                <Button asChild className="btn-shine h-14 px-8 font-black text-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_4px_0_0_#047857,0_10px_20px_-5px_rgba(16,185,129,0.4)] active:shadow-[0_2px_0_0_#047857] active:translate-y-[2px] transition-all rounded-xl border-none">
                                    <a href="https://arlog.org/proximos-cursos-de-capacitacion/" target="_blank" rel="noopener noreferrer">
                                        <span className="relative z-10">Ver Próximos Cursos</span>
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute hidden md:flex bottom-8 right-6 lg:right-12 gap-3 z-20">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={scrollPrev}
                    className="h-12 w-12 rounded-full bg-slate-200/80 backdrop-blur-md text-black hover:bg-slate-300 hover:text-black border border-slate-300/50 transition-all"
                >
                    <ChevronLeft size={24} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={scrollNext}
                    className="h-12 w-12 rounded-full bg-slate-200/80 backdrop-blur-md text-black hover:bg-slate-300 hover:text-black border border-slate-300/50 transition-all"
                >
                    <ChevronRight size={24} />
                </Button>
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-20 lg:bottom-12 left-0 right-0 flex justify-center lg:justify-start lg:pl-20 gap-2 z-20 pointer-events-none">
                <div className="pointer-events-auto flex gap-2">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`h-2 rounded-full transition-all duration-500 ${
                                index === selectedIndex 
                                    ? 'w-10 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]' 
                                    : 'w-2 bg-white/50 hover:bg-white/80'
                            }`}
                            aria-label={`Ir al slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
