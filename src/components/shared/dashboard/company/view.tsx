"use client";

import { useState } from "react";
import { JobList } from "./job-list";
import { CompanyProfileForm } from "./company-profile-form";
import { Briefcase, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "jobs" | "profile";

export function CompanyView({ jobs = [], profile }: { jobs: any[], profile?: any }) {
    const [activeTab, setActiveTab] = useState<Tab>("jobs");

    return (
        <div className="max-w-6xl mx-auto py-8 px-6">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-slate-900">Panel de Empresa</h1>
                    <p className="text-slate-500">
                        Gestiona tus ofertas activas y mantén actualizado tu perfil corporativo.
                    </p>
                </div>
            </div>

            {/* TAB NAVIGATION (Cards Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* CARD 1: Mis Ofertas */}
                <button
                    onClick={() => setActiveTab("jobs")}
                    className={cn(
                        "group p-6 rounded-xl border transition-all text-left w-full relative overflow-hidden",
                        activeTab === "jobs"
                            ? "bg-blue-50 border-blue-200 shadow-md ring-1 ring-blue-200"
                            : "bg-white hover:shadow-lg hover:border-blue-200"
                    )}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                            activeTab === "jobs"
                                ? "bg-blue-600 text-white"
                                : "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
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
                            <h3 className={cn("text-lg font-bold", activeTab === "jobs" ? "text-blue-900" : "text-slate-800")}>
                                Mis Ofertas
                            </h3>
                            <p className="text-slate-500 text-sm mt-1">Administra tus vacantes activas.</p>
                        </div>
                        <span className="text-3xl font-bold text-slate-700">{jobs.length}</span>
                    </div>
                </button>

                {/* CARD 2: Perfil de Empresa */}
                <button
                    onClick={() => setActiveTab("profile")}
                    className={cn(
                        "group p-6 rounded-xl border transition-all text-left w-full relative overflow-hidden",
                        activeTab === "profile"
                            ? "bg-indigo-50 border-indigo-200 shadow-md ring-1 ring-indigo-200"
                            : "bg-white hover:shadow-lg hover:border-indigo-200"
                    )}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                            activeTab === "profile"
                                ? "bg-indigo-600 text-white"
                                : "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
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
                            <h3 className={cn("text-lg font-bold", activeTab === "profile" ? "text-indigo-900" : "text-slate-800")}>
                                Perfil de Empresa
                            </h3>
                            <p className="text-slate-500 text-sm mt-1">Logo, sitio web y detalles.</p>
                        </div>
                        <div className="text-right">
                            {/* Indicador visual de estado del perfil */}
                            {profile?.logo && profile?.description ? (
                                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Completo</span>
                            ) : (
                                <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">Incompleto</span>
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
