"use client";

import { AnimatedCounter } from "./animated-counter";
import { Briefcase, Users, Building2 } from "lucide-react";

export function HeroStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
      {/* Stat 1 — Oportunidades */}
      <div className="group relative p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-black/5 shadow-sm transition-all duration-300 hover:-translate-y-1">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <Briefcase size={18} />
          </div>
          <div className="text-3xl font-extrabold text-foreground tracking-tight">
            <AnimatedCounter target={128} duration={2000} suffix="+" />
          </div>
          <div className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">
            Oportunidades
          </div>
        </div>
      </div>

      {/* Stat 2 — Talentos */}
      <div className="group relative p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-black/5 shadow-sm transition-all duration-300 hover:-translate-y-1">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
            <Users size={18} />
          </div>
          <div className="text-3xl font-extrabold text-foreground tracking-tight relative">
            <AnimatedCounter target={840} duration={2200} />
            <span className="absolute -top-1 -right-5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">
            Talentos
          </div>
        </div>
      </div>

      {/* Stat 3 — Empresas */}
      <div className="group relative p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-black/5 shadow-sm transition-all duration-300 hover:-translate-y-1">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
            <Building2 size={18} />
          </div>
          <div className="text-3xl font-extrabold text-foreground tracking-tight">
            <AnimatedCounter target={42} duration={1800} />
          </div>
          <div className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">
            Empresas
          </div>
        </div>
      </div>
    </div>
  );
}
