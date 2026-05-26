import Link from "next/link";
import { RoleCard } from "./role-card";
import { HeroStats } from "./hero-stats";
import { HeroSlider } from "./hero-slider";

interface HeroProps {
  user?: {
    role: string;
    name?: string;
  } | null;
}

export function Hero({ user }: HeroProps) {
  const isGuest = !user;

  return (
    <div className="relative w-full pb-10">
      {/* ─── Hero Slider ─── */}
      <HeroSlider />

      <div className="max-w-6xl mx-auto px-6 relative z-10 -mt-16 lg:-mt-24">
        {/* ─── Stats Row ─── */}
        <HeroStats />

        {/* ─── Role Cards for Guests ─── */}
        {isGuest && (
          <div className="grid gap-6 mt-12 mx-auto text-left md:grid-cols-2 max-w-4xl">
            <RoleCard
              title="Soy Candidato"
              icon="👤"
              description="Busco mi próximo desafío en logística, transporte o almacén."
              borderColor="blue"
              primaryAction={{
                label: "Ingresar",
                href: "/login"
              }}
              secondaryAction={{
                label: "Registrarse",
                href: "/register/candidate"
              }}
            />

            <RoleCard
              title="Soy Empresa"
              icon="🏢"
              description="Busco talento calificado para potenciar mi operación logística."
              borderColor="blue"
              primaryAction={{
                label: "Ingresar",
                href: "/login"
              }}
              secondaryAction={{
                label: "Registrarse",
                href: "/register/company"
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}