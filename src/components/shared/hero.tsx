import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RoleCard } from "./role-card";

interface HeroProps {
  user?: {
    role: string;
    name?: string;
  } | null;
}

export function Hero({ user }: HeroProps) {
  const isCompany = user?.role === 'company';
  const isCandidate = user?.role === 'candidate';
  const isGuest = !user;

  return (
    <div className="bg-background text-foreground pt-20 pb-24 px-6 relative overflow-hidden transition-colors duration-300">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[120px] pointer-events-none opacity-100 dark:bg-primary/10 dark:opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-400/20 blur-[100px] pointer-events-none opacity-100 dark:bg-blue-400/10 dark:opacity-40"></div>
      <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-primary/40 rounded-full blur-2xl animate-pulse dark:bg-primary/20"></div>
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-emerald-400/5 rounded-full blur-[100px] pointer-events-none dark:opacity-5"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mt-6 leading-tight">
          El Hub del Talento <br />
          <span className="text-primary">
            Logístico & Operativo.
          </span>
        </h1>

        <p className="text-muted-foreground mt-6 text-lg max-w-2xl mx-auto">
          Conectamos a las empresas líderes con los profesionales que mueven el mundo. Simple, rápido y efectivo.
        </p>

        {/* Las 3 Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto mt-12 border-t border-border pt-8">
          <div>
            <div className="text-3xl font-bold text-primary">128</div>
            <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Oportunidades</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary relative inline-block">
              840
              <span className="absolute -top-1 -right-4 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Talentos</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">42</div>
            <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Empresas</div>
          </div>
        </div>

        {/* Tarjetas Informativas solo para Invitados */}
        {isGuest && (
          <div className="grid gap-6 mt-16 mx-auto text-left md:grid-cols-2 max-w-4xl">
            {/* Card Candidato */}
            <RoleCard
              title="Soy Candidato"
              icon="👤"
              description="Busco mi próximo desafío en logística, transporte o almacén."
              borderColor="blue"
              primaryAction={{
                label: "Ver Ofertas",
                href: "/#ofertas"
              }}
              secondaryAction={{
                label: "Ingresar",
                href: "/login"
              }}
            />

            {/* Card Empresa */}
            <RoleCard
              title="Soy Empresa"
              icon="🏢"
              description="Busco talento calificado para potenciar mi operación logística."
              borderColor="blue"
              primaryAction={{
                label: "Publicar Aviso",
                href: "/jobs/new"
              }}
              secondaryAction={{
                label: "Registrar Empresa",
                href: "/register?role=company"
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
}