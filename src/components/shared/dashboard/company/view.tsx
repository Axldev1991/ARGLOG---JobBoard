"use client";

import { useRouter } from "next/navigation";
import { JobList } from "./job-list";
import { CompanyProfileForm } from "./company-profile-form";
import { Briefcase, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "jobs" | "profile";

export function CompanyView({
    jobs = [],
    profile,
    activeTab: initialTab = "jobs"
}: {
    jobs: any[],
    profile?: any,
    activeTab?: Tab
}) {
    const router = useRouter();
    const activeTab = initialTab || "jobs";

    const handleTabChange = (newTab: Tab) => {
        router.push(`/dashboard?tab=${newTab}`, { scroll: false });
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-6">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-foreground">Panel de Empresa</h1>
                    <p className="text-muted-foreground">
                        Gestiona tus ofertas activas y mantén actualizado tu perfil corporativo.
                    </p>
                </div>
            </div>

            {/* TAB NAVIGATION (Cards Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* CARD 1: Mis Ofertas */}
                <button
                    onClick={() => handleTabChange("jobs")}
                    className={cn(
                        "group p-6 rounded-xl border transition-all text-left w-full relative overflow-hidden",
                        activeTab === "jobs"
                            ? "bg-primary/5 border-primary shadow-md ring-1 ring-primary"
                            : "bg-card hover:shadow-lg hover:border-primary/50 text-card-foreground"
                    )}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                            activeTab === "jobs"
                                ? "bg-primary text-primary-foreground"
                                : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                        )}>
                            <Briefcase size={24} />
                        </div>
                        {activeTab === "jobs" && (
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-in fade-in zoom-in">
                                Activo
                            </span>
                        )}
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className={cn("text-lg font-bold", activeTab === "jobs" ? "text-primary" : "text-foreground")}>
                                Mis Ofertas
                            </h3>
                            <p className="text-muted-foreground text-sm mt-1">Administra tus vacantes activas.</p>
                        </div>
                        <span className="text-3xl font-bold text-foreground">{jobs.length}</span>
                    </div>
                </button>

                {/* CARD 2: Perfil de Empresa */}
                <button
                    onClick={() => handleTabChange("profile")}
                    className={cn(
                        "group p-6 rounded-xl border transition-all text-left w-full relative overflow-hidden",
                        activeTab === "profile"
                            ? "bg-indigo-500/10 border-indigo-500 shadow-md ring-1 ring-indigo-500"
                            : "bg-card hover:shadow-lg hover:border-indigo-500/50 text-card-foreground"
                    )}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                            activeTab === "profile"
                                ? "bg-indigo-600 text-white"
                                : "bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white"
                        )}>
                            <Building2 size={24} />
                        </div>
                        {activeTab === "profile" && (
                            <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-in fade-in zoom-in">
                                Activo
                            </span>
                        )}
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className={cn("text-lg font-bold", activeTab === "profile" ? "text-indigo-600 dark:text-indigo-400" : "text-foreground")}>
                                Perfil de Empresa
                            </h3>
                            <p className="text-muted-foreground text-sm mt-1">Logo, sitio web y detalles.</p>
                        </div>
                        <div className="text-right">
                            {/* Indicador visual de estado del perfil */}
                            {profile?.logo && profile?.description ? (
                                <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-500/10 dark:text-green-400 px-2 py-1 rounded-full">Completo</span>
                            ) : (
                                <span className="text-xs font-medium text-amber-600 bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 px-2 py-1 rounded-full">Incompleto</span>
                            )}
                        </div>
                    </div>
                </button>
            </div>

            {/* CONTENT AREA */}
            <div className="min-h-[400px]">
                {activeTab === "jobs" ? (
                    <JobList jobs={jobs} />
                ) : (
                    <CompanyProfileForm profile={profile} />
                )}
            </div>
        </div>
    );
}
