import { Button } from "@/components/ui/button";
import { Building2, Sparkles } from "lucide-react";
import Link from "next/link";

export function HomeCTA() {
    return (
        <section className="w-full">
            {/* Main CTA - Fixed 400px Height Banner */}
            <div className="w-full h-[400px] relative flex items-center overflow-visible my-12 group/cta bg-transparent dark:bg-blue-600 dark:overflow-hidden dark:rounded-none">
                {/* Glass Background Elements */}
                <div className="absolute inset-0 transition-all duration-700 dark:hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-white/40 backdrop-blur-[var(--glass-blur)] rounded-[3rem] border border-white/40 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-transform duration-700 group-hover/cta:scale-[1.02]" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-bounce duration-[10s]" />
                </div>
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
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary dark:bg-white/10 dark:border-white/20 dark:text-white text-[10px] font-black backdrop-blur-sm tracking-widest uppercase">
                                <Sparkles className="w-3 h-3" />
                                <span>LIDERANDO LA INDUSTRIA</span>
                            </div>
                            <h2 className="text-4xl md:text-[58px] font-black leading-[1] tracking-tighter uppercase text-primary dark:text-white">
                                Impulsá tu carrera en el <br className="hidden md:block" />{" "}
                                sector que mueve al país
                            </h2>
                            <p className="text-base md:text-xl max-w-2xl font-medium leading-relaxed text-muted-foreground dark:text-white/90">
                                Accedé a las mejores vacantes, compará sueldos promedio y
                                postulate en las empresas líderes. Todo en un solo lugar.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 items-center lg:items-end">
                            <Link href="/login">
                                <Button
                                    size="lg"
                                    className="h-16 px-10 font-black text-lg rounded-2xl transition-all active:translate-y-[2px] active:shadow-[0_2px_0_0_#1e3a8a] active:scale-[0.98] bg-gradient-to-b from-primary via-primary to-blue-800 text-white shadow-[0_6px_0_0_#1e3a8a,0_15px_30px_-10px_rgba(var(--primary),0.5),inset_0_1px_0_0_rgba(255,255,255,0.4),inset_0_-2px_0_0_rgba(0,0,0,0.2)] ring-1 ring-primary/20 hover:shadow-[0_8px_0_0_#1e3a8a,0_20px_40px_-15px_rgba(var(--primary),0.7)] hover:-translate-y-[2px] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:h-1/2 dark:bg-white dark:from-white dark:to-zinc-100 dark:text-blue-600 dark:border-none dark:shadow-xl dark:ring-0 dark:hover:translate-y-0 dark:before:hidden"
                                >
                                    <span className="relative z-10">REGISTRATE GRATIS</span>
                                </Button>
                            </Link>
                            <div className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border backdrop-blur-sm bg-primary/10 text-primary border-primary/20 dark:bg-blue-700/50 dark:text-white/80 dark:border-white/10">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse dark:bg-green-400" />
                                <span>84 nuevas vacantes hoy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </section>
    );
}
