import { Button } from "@/components/ui/button";
import { Building2, Sparkles } from "lucide-react";
import Link from "next/link";

export function HomeCTA() {
    return (
        <section className="w-full">
            {/* Main CTA - Fixed 400px Height Banner */}
            <div className="w-full bg-blue-600 h-[400px] relative flex items-center overflow-hidden my-12 shadow-2xl shadow-blue-900/20">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg
                        height="100%"
                        preserveAspectRatio="none"
                        viewBox="0 0 800 400"
                        width="100%"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M600 0 L800 0 L800 400 L400 400 Z" fill="white" />
                        <circle cx="700" cy="100" fill="white" r="50" />
                        <circle
                            cx="200"
                            cy="300"
                            fill="none"
                            r="150"
                            stroke="white"
                            strokeWidth="2"
                        />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16 text-center lg:text-left">
                        <div className="space-y-6 lg:w-2/3">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black backdrop-blur-sm tracking-widest uppercase">
                                <Sparkles className="w-3 h-3" />
                                <span>LIDERANDO LA INDUSTRIA</span>
                            </div>
                            <h2 className="text-4xl md:text-[58px] font-black text-white leading-[1] tracking-tighter uppercase">
                                Impulsá tu carrera en el <br className="hidden md:block" />{" "}
                                sector que mueve al país
                            </h2>
                            <p className="text-base md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
                                Accedé a las mejores vacantes, compará sueldos promedio y
                                postulate en las empresas líderes. Todo en un solo lugar.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 items-center lg:items-end">
                            <Link href="/login">
                                <Button
                                    size="lg"
                                    className="h-16 px-10 rounded-xl bg-white text-blue-600 hover:bg-zinc-50 font-black text-base shadow-xl transition-all hover:scale-105 active:scale-95"
                                >
                                    REGISTRATE GRATIS
                                </Button>
                            </Link>
                            <div className="flex items-center gap-2 text-white/80 text-xs font-bold bg-blue-700/50 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span>84 nuevas vacantes hoy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </section>
    );
}
