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
    <div className="bg-[#0f172a] text-white pt-20 pb-24 px-6 relative overflow-hidden">
      {/* Efecto de fondo (opcional, una luz violeta sutil) */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-500/10 blur-[100px]"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mt-6 leading-tight">
          El Hub del Talento <br />
          <span className="text-white">
            Logístico & Operativo.
          </span>
        </h1>

        <p className="text-slate-400 mt-6 text-lg max-w-2xl mx-auto">
          Conectamos a las empresas líderes con los profesionales que mueven el mundo. Simple, rápido y efectivo.
        </p>

        {/* Las 3 Estadísticas */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12 border-t border-slate-800 pt-8">
          <div>
            <div className="text-3xl font-bold">128</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Oportunidades</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400">840</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Talentos</div>
          </div>
          <div>
            <div className="text-3xl font-bold">42</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Empresas</div>
          </div>
        </div>

        {/* Tarjetas Dinámicas según Rol */}
        <div className={`grid gap-6 mt-16 mx-auto text-left ${isGuest ? 'md:grid-cols-2 max-w-4xl' : 'max-w-lg'}`}>

          {/* Si soy Invitado o Candidato -> Muestro Card Candidato */}
          {(isGuest || isCandidate) && (
            <RoleCard
              title={isCandidate ? "Bienvenido, Colega" : "Soy Candidato"}
              icon="👤"
              description={isCandidate ? "Explora las nuevas vacantes y lleva tu carrera al siguiente nivel." : "Busco mi próximo desafío en logística, transporte o almacén."}
              borderColor="blue"
              primaryAction={{
                label: "Ver Ofertas",
                href: "/#ofertas"
              }}
              secondaryAction={isCandidate ? {
                label: "Mi Perfil",
                href: "/dashboard" // Asumimos que el candidato también tiene un dashboard por ahora
              } : {
                label: "Ingresar",
                href: "/login"
              }}
            />
          )}

          {/* Si soy Invitado o Empresa -> Muestro Card Empresa */}
          {(isGuest || isCompany) && (
            <RoleCard
              title={isCompany ? "Panel de Empresa" : "Soy Empresa"}
              icon="🏢"
              description={isCompany ? "Gestiona tus publicaciones y encuentra el talento ideal." : "Busco talento calificado para potenciar mi operación."}
              borderColor="blue"
              primaryAction={{
                label: "Publicar Aviso",
                href: "/jobs/new"
              }}
              secondaryAction={{
                label: isCompany ? "Ir al Dashboard" : "Dashboard",
                href: "/dashboard"
              }}
            />
          )}

        </div>

      </div>
    </div>
  );
}