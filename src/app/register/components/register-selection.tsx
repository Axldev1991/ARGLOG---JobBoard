import Link from "next/link";
import { Users, Building2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function RegisterSelection() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
            {/* OPCIÓN CANDIDATO */}
            <Link 
                href="/register/candidate"
                className={cn(
                    "group relative p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-xl",
                    "hover:border-primary/50 hover:bg-primary/5 transition-all duration-500",
                    "hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]"
                )}
            >
                <div className="flex flex-col h-full items-center text-center">
                    <div className="p-4 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Users size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">Soy Talento</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                        Quiero postularme a las mejores vacantes del sector logístico argentino.
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all uppercase tracking-widest text-xs">
                        Comenzar Registro
                        <ArrowRight size={16} />
                    </div>
                </div>
            </Link>

            {/* OPCIÓN EMPRESA */}
            <Link 
                href="/register/company"
                className={cn(
                    "group relative p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-xl",
                    "hover:border-primary/50 hover:bg-primary/5 transition-all duration-500",
                    "hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]"
                )}
            >
                <div className="flex flex-col h-full items-center text-center">
                    <div className="p-4 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Building2 size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">Soy Empresa</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                        Quiero publicar ofertas y encontrar al mejor talento para mi operación.
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all uppercase tracking-widest text-xs">
                        Solicitar Onboarding
                        <ArrowRight size={16} />
                    </div>
                </div>
            </Link>
        </div>
    );
}
